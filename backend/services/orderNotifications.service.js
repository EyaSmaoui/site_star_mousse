const nodemailer = require('nodemailer');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

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

  return nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpSecure, auth: { user: smtpUser, pass: smtpPass } });
};

const buildOrderSummaryHtml = (order) => {
  const itemsHtml = (order.items || order.products || []).map((item) => (
    `<li style="margin-bottom:8px;"><strong>${escapeHtml(item.name)}</strong> x${Number(item.quantity || 1)} - ${Number(item.price || 0).toFixed(2)} DT</li>`
  )).join('');
  return `<div style="font-family:Arial,sans-serif;color:#151522;line-height:1.6;">
    <h2>Merci pour votre commande, ${escapeHtml(order.customerName || 'Client')} !</h2>
    <p>Votre commande <strong>#${escapeHtml(order._id?.toString().slice(-8))}</strong> a bien été enregistrée.</p>
    <p><strong>Montant total :</strong> ${Number(order.total || 0).toFixed(2)} DT</p>
    <p><strong>Mode de paiement :</strong> ${escapeHtml(order.paymentMethod || 'Non spécifié')}</p>
    <p><strong>Adresse de livraison :</strong><br>${escapeHtml(order.address)}</p>
    <p><strong>Téléphone :</strong> ${escapeHtml(order.phone)}</p>
    <h3>Détails de la commande</h3><ul style="padding-left:16px;">${itemsHtml}</ul>
    <p><strong>Frais de livraison :</strong> ${Number(order.shippingCost || 0).toFixed(2)} DT</p>
    <p>Nous vous contacterons dès que votre commande sera prête à être expédiée.</p>
    <p>Cordialement,<br>Équipe Star Mousse</p>
  </div>`;
};

const sendOrderConfirmationEmail = async ({ order, email, subject }) => {
  const recipient = email || order?.customerEmail;
  if (!recipient) return false;
  const transporter = createMailTransporter();
  if (!transporter) return false;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipient,
    subject: subject || `Confirmation de commande ${order?._id?.toString().slice(-8) || ''} - Star Mousse`,
    html: buildOrderSummaryHtml(order),
  });
  return true;
};

module.exports = { buildOrderSummaryHtml, sendOrderConfirmationEmail };
