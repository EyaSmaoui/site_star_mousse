const Stripe = require('stripe');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { sendOrderConfirmationEmail } = require('../services/orderNotifications.service');
const {
  releaseOrderStock,
} = require('../services/orderPricing.service');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY;
const stripe = STRIPE_SECRET_KEY ? Stripe(STRIPE_SECRET_KEY) : null;

exports.createStripeSession = async (req, res) => res.status(503).json({ message: 'Le paiement par carte en TND n’est pas disponible pour le moment. Choisissez le paiement à la livraison.' });

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod = 'cash_on_delivery' } = req.body;
    if (!orderId || !transactionId) {
      return res.status(400).json({ message: 'orderId et transactionId sont requis.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }
    const isOwner = req.user && (
      String(order.userId || '') === String(req.user._id)
      || String(order.customerEmail || '').toLowerCase() === String(req.user.email || '').toLowerCase()
    );
    const isStaff = req.user && ['admin', 'manager', 'employee', 'employeur'].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Accès refusé pour cette commande.' });
    }
    if (order.status === 'annulé') {
      return res.status(409).json({ message: 'Une commande annulée ne peut pas recevoir de paiement.' });
    }
    if (paymentMethod !== 'cash_on_delivery') {
      return res.status(400).json({ message: 'Les paiements en ligne sont confirmés par Stripe.' });
    }
    const existingPayment = await Payment.findOne({ transactionId: String(transactionId) });
    if (existingPayment) {
      if (String(existingPayment.orderId) !== String(order._id)) {
        return res.status(409).json({ message: 'Cet identifiant de transaction est déjà utilisé.' });
      }
      return res.status(200).json({ payment: existingPayment, order });
    }

    const payment = await Payment.create({
      orderId: order._id,
      amount: Number(order.total || 0),
      currency: 'TND',
      paymentMethod,
      status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
      transactionId: String(transactionId),
      paymentDetails: {},
    });

    if (paymentMethod === 'cash_on_delivery') {
      order.status = 'en attente';
      await order.save();
    }

    await sendOrderConfirmationEmail({
      email: order.customerEmail,
      subject: `Confirmation de commande ${order._id.toString().slice(-8)} - Star Mousse`,
      order,
    }).catch((mailError) => console.error('E-mail de confirmation non envoyé:', mailError.message));

    res.status(201).json({ payment, order });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    const status = error?.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: 'Impossible d’enregistrer le paiement.', error: error.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret || !sig) {
      console.warn('Webhook Stripe reçu mais mal configuré.');
      return res.status(400).json({ message: 'Webhook Stripe mal configuré.' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Signature Stripe invalide:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.expired') {
      const { orderId, paymentId } = event.data.object.metadata || {};
      if (paymentId) await Payment.updateOne({ _id: paymentId, status: 'pending' }, { $set: { status: 'failed' } });
      if (orderId) await cancelStripeOrderAndReleaseStock(orderId);
      return res.status(200).json({ received: true });
    }

    if (event.type === 'payment_intent.payment_failed') {
      const { orderId, paymentId } = event.data.object.metadata || {};
      if (paymentId) await Payment.updateOne({ _id: paymentId, status: 'pending' }, { $set: { status: 'failed' } });
      if (orderId) await cancelStripeOrderAndReleaseStock(orderId);
      return res.status(200).json({ received: true });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.payment_status !== 'paid') {
        return res.status(200).json({ received: true, pending: true });
      }
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      const paymentIntentId = session.payment_intent;

      if (paymentId) {
        const paymentRecord = await Payment.findOneAndUpdate(
          { _id: paymentId, status: 'pending' },
          {
            $set: {
              status: 'completed',
              completedAt: new Date(),
              'paymentDetails.stripePaymentIntentId': paymentIntentId,
            },
          },
          { new: true },
        );
        const paymentAlreadyCompleted = !paymentRecord && await Payment.exists({ _id: paymentId, status: 'completed' });

        if ((paymentRecord || paymentAlreadyCompleted) && orderId) {
          const order = await Order.findOne({ _id: orderId, status: 'en attente' });
          if (order) {
            order.status = 'en cours';
            await order.save();
            await sendOrderConfirmationEmail({
              subject: `Paiement confirme pour votre commande ${order._id.toString().slice(-8)}`,
              order,
            }).catch((mailError) => console.error('Order confirmation email was not sent:', mailError.message));
          }
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(500).json({ message: 'Erreur webhook Stripe', error: error.message });
  }
};

const cancelStripeOrderAndReleaseStock = async (orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: 'en attente', stockReservedAt: { $exists: true }, stockRestoredAt: { $exists: false } },
    { $set: { status: 'annulé', stockRestoredAt: new Date() } },
    { new: true },
  );
  if (!order) return;
  try {
    await releaseOrderStock(order.products || []);
  } catch (error) {
    await Order.updateOne(
      { _id: order._id, stockRestoredAt: { $exists: true } },
      { $unset: { stockRestoredAt: 1 } },
    );
    throw error;
  }
};
