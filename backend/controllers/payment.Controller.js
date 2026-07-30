const Stripe = require('stripe');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const nodemailer = require('nodemailer');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY;
const stripe = STRIPE_SECRET_KEY ? Stripe(STRIPE_SECRET_KEY) : null;

const createMailTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = Number(process.env.SMTP_PORT || 587);
  let smtpSecure = process.env.SMTP_SECURE === 'true';

  if (!smtpUser || !smtpPass || smtpUser === 'votre.email@gmail.com') return null;

  if (!smtpHost && smtpUser.toLowerCase().endsWith('@gmail.com')) {
    smtpHost = 'smtp.gmail.com';
    smtpPort = 465;
    smtpSecure = true;
  }
  if (!smtpHost) return null;

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });
};

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

const sendOrderConfirmationEmail = async ({ email, subject, html }) => {
  if (!email) return false;
  const transporter = createMailTransporter();
  if (!transporter) return false;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    html,
  });
  return true;
};

const buildOrderSummaryHtml = (order) => {
  const itemsHtml = (order.items || order.products || [])
    .map((item) => `<li style="margin-bottom:8px;"><strong>${item.name}</strong> x${item.quantity} - ${Number(item.price).toFixed(2)} DT</li>`)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #151522; line-height: 1.6;">
      <h2>Merci pour votre commande, ${order.customerName || 'Client'}!</h2>
      <p>Votre commande <strong>#${order._id?.toString().slice(-8)}</strong> a bien été enregistrée.</p>
      <p><strong>Montant total :</strong> ${Number(order.total || 0).toFixed(2)} DT</p>
      <p><strong>Mode de paiement :</strong> ${order.paymentMethod || 'Non spécifié'}</p>
      <p><strong>Adresse de livraison :</strong><br>${order.address}</p>
      <p><strong>Téléphone :</strong> ${order.phone}</p>
      <h3>Détails de la commande</h3>
      <ul style="padding-left: 16px;">${itemsHtml}</ul>
      <p><strong>Frais de livraison :</strong> ${Number(order.shippingCost || 0).toFixed(2)} DT</p>
      <p>Nous vous contacterons dès que votre commande sera prête à être expédiée.</p>
      <p style="margin-top:24px;">Cordialement,<br>Équipe Star Mousse</p>
    </div>
  `;
};

const sanitizeCartProducts = (products = []) => {
  if (!Array.isArray(products)) return [];
  return products
    .filter((product) => product && product.name)
    .map((product) => ({
      name: String(product.name || 'Produit Star Mousse'),
      quantity: Math.max(1, Number(product.quantity || 1)),
      price: Number(product.price || 0),
      dimension: String(product.dimension || ''),
    }));
};

exports.createStripeSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe n’est pas configuré sur le serveur.' });
    }

    const { customerName, customerEmail, phone, address, region, shippingCost = 0, products, paymentMethod } = req.body;
    const lineItems = sanitizeCartProducts(products);
    if (!lineItems.length || !customerEmail || !phone || !address) {
      return res.status(400).json({ message: 'Données de commande incomplètes pour Stripe.' });
    }

    const subtotal = lineItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    const total = Number(subtotal) + Number(shippingCost || 0);

    const order = await Order.create({
      customerName: String(customerName || 'Client').trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      products: lineItems,
      items: lineItems,
      total,
      shippingCost: Number(shippingCost || 0),
      region: String(region || '').trim(),
      paymentMethod: paymentMethod || 'stripe',
      status: 'en attente',
    });

    const payment = await Payment.create({
      orderId: order._id,
      amount: total,
      currency: 'TND',
      paymentMethod: 'stripe',
      status: 'pending',
      transactionId: `stripe_${order._id}`,
      paymentDetails: {},
    });

    const stripeLineItems = lineItems.map((item) => ({
      price_data: {
        currency: 'TND',
        product_data: { name: item.name || 'Article Star Mousse' },
        unit_amount: Math.round(Number(item.price || 0) * 100),
      },
      quantity: Number(item.quantity || 1),
    }));

    if (Number(shippingCost || 0) > 0) {
      stripeLineItems.push({
        price_data: {
          currency: 'TND',
          product_data: { name: 'Frais de livraison Star Mousse' },
          unit_amount: Math.round(Number(shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: stripeLineItems,
      metadata: {
        orderId: order._id.toString(),
        paymentId: payment._id.toString(),
      },
      success_url: `${getFrontendUrl()}/order-confirmation/${order._id}?payment=success&email=${encodeURIComponent(customerEmail)}`,
      cancel_url: `${getFrontendUrl()}/checkout`,
      shipping_address_collection: { allowed_countries: ['TN'] },
    });

    payment.paymentDetails = { stripeSessionId: session.id };
    await payment.save();

    res.status(201).json({ url: session.url });
  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    res.status(500).json({ message: 'Impossible de créer la session de paiement Stripe.', error: error.message });
  }
};

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
      html: buildOrderSummaryHtml(order),
    });

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
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Signature Stripe invalide:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      const paymentIntentId = session.payment_intent;

      if (paymentId) {
        const paymentRecord = await Payment.findById(paymentId);
        if (paymentRecord) {
          paymentRecord.status = 'completed';
          paymentRecord.completedAt = new Date();
          paymentRecord.paymentDetails = {
            ...paymentRecord.paymentDetails,
            stripePaymentIntentId: paymentIntentId,
          };
          await paymentRecord.save();
        }
      }

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.status = 'en cours';
          await order.save();
          await sendOrderConfirmationEmail({
            email: order.customerEmail,
            subject: `Paiement confirmé pour votre commande ${order._id.toString().slice(-8)}`,
            html: buildOrderSummaryHtml(order),
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(500).json({ message: 'Erreur webhook Stripe', error: error.message });
  }
};
