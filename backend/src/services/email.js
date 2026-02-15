const nodemailer = require('nodemailer');

function createTransporter() {
  const user = process.env.EMAIL_HOST_USER;
  const pass = process.env.EMAIL_HOST_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: { user, pass },
  });
}

async function sendNotification(contact) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[EMAIL] No SMTP credentials configured — skipping notification.');
    return;
  }

  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL
    || process.env.EMAIL_HOST_USER;

  const createdAt = new Date(contact.created_at).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:24px;color:#fff;text-align:center;">
        <h2 style="margin:0;">New Portfolio Contact</h2>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Name</td><td style="padding:8px 0;">${contact.name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Phone</td><td style="padding:8px 0;">${contact.phone_number || '—'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Time</td><td style="padding:8px 0;">${createdAt}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
        <p style="white-space:pre-wrap;color:#333;">${contact.message}</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_HOST_USER}>`,
    to: recipient,
    subject: `Portfolio Contact: ${contact.name}`,
    text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone_number || '—'}\nTime: ${createdAt}\n\n${contact.message}`,
    html,
  });

  console.log(`[EMAIL] Notification sent for message #${contact.id}`);
}

module.exports = { sendNotification };
