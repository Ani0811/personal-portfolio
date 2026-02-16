const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { buildNotificationHtml, buildAutoReplyHtml } = require('./email-templates');

/* ─────────────── Environment-based Routing ─────────────── */

/**
 * In production, use Gmail API (OAuth2) for reliability with OAuth Playground tokens.
 * In development, use SMTP for easier local testing.
 */
const USE_GMAIL_API = process.env.NODE_ENV === 'production' && 
  process.env.EMAIL_OAUTH_CLIENT_ID && 
  process.env.EMAIL_OAUTH_CLIENT_SECRET && 
  process.env.EMAIL_OAUTH_REFRESH_TOKEN;

if (USE_GMAIL_API) {
  console.log('[EMAIL] Production mode: Using Gmail API for OAuth2');
  const gmailAPI = require('./email-gmail-api');
  module.exports = {
    sendNotification: gmailAPI.sendNotification,
    sendAutoReply: gmailAPI.sendAutoReply,
  };
} else {
  console.log('[EMAIL] Development mode: Using SMTP');
  
  /* ─────────────── SMTP Implementation ─────────────── */

  async function createTransporter() {
    const oauthClientId = process.env.EMAIL_OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.EMAIL_OAUTH_CLIENT_SECRET;
    const oauthRefreshToken = process.env.EMAIL_OAUTH_REFRESH_TOKEN;
    const user = process.env.EMAIL_HOST_USER;

    // Prefer OAuth2 if configured
    if (oauthClientId && oauthClientSecret && oauthRefreshToken && user) {
      console.log('[EMAIL] Creating OAuth2 transporter for', user);
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user,
          clientId: oauthClientId,
          clientSecret: oauthClientSecret,
          refreshToken: oauthRefreshToken,
        },
        tls: { rejectUnauthorized: false },
        debug: true,
        logger: true,
      });
      
      return transporter;
    }

    // SMTP fallback (username/password)
    const pass = process.env.EMAIL_HOST_PASSWORD;
    if (!user || !pass) return null;

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  /* ─────────────── Send Functions (SMTP) ─────────────── */

  async function sendNotification(contact) {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log('[EMAIL] No SMTP credentials configured — skipping notification.');
      return;
    }

    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL
      || process.env.EMAIL_HOST_USER;

    const createdAt = new Date(contact.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    const text = `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone_number || '—'}\nTime: ${createdAt}\n\n${contact.message}`;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_HOST_USER}>`,
      to: recipient,
      subject: `✦ Portfolio Contact: ${contact.name}`,
      text,
      html: buildNotificationHtml(contact, createdAt),
    });

    console.log(`[EMAIL] Notification sent via SMTP for message #${contact.id}`);
  }

  async function sendAutoReply(contact) {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log('[EMAIL] No SMTP credentials configured — skipping auto-reply.');
      return;
    }

    const text = `Hi ${contact.name},\n\nThank you for getting in touch through my portfolio. I've received your message and will get back to you as soon as possible — usually within 24-48 hours.\n\nYour message:\n"${contact.message}"\n\nBest regards,\nAnirudha Basu Thakur`;

    await transporter.sendMail({
      from: `"Anirudha Basu Thakur" <${process.env.EMAIL_HOST_USER}>`,
      to: contact.email,
      subject: `Thanks for reaching out, ${contact.name}!`,
      text,
      html: buildAutoReplyHtml(contact),
    });

    console.log(`[EMAIL] Auto-reply sent via SMTP to ${contact.email}`);
  }

  module.exports = { sendNotification, sendAutoReply };
}
