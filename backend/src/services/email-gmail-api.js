const { google } = require('googleapis');
const { buildNotificationHtml, buildAutoReplyHtml } = require('./email-templates');

/**
 * Send email using Gmail API (not SMTP).
 * Works reliably with OAuth Playground tokens.
 */
async function sendViaGmailAPI({ to, from, subject, text, html }) {
  const oauthClientId = process.env.EMAIL_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.EMAIL_OAUTH_CLIENT_SECRET;
  const oauthRefreshToken = process.env.EMAIL_OAUTH_REFRESH_TOKEN;
  const user = process.env.EMAIL_HOST_USER;

  if (!oauthClientId || !oauthClientSecret || !oauthRefreshToken || !user) {
    throw new Error('Missing OAuth2 environment variables');
  }

  const oAuth2Client = new google.auth.OAuth2(
    oauthClientId,
    oauthClientSecret,
    'https://developers.google.com/oauthplayground'
  );
  oAuth2Client.setCredentials({ refresh_token: oauthRefreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  // Build RFC 2822 formatted message
  const messageParts = [
    `From: ${from || user}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html || text,
  ];
  const message = messageParts.join('\r\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data;
}

/* ─────────────── Send Functions (Gmail API) ─────────────── */

async function sendNotification(contact) {
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.EMAIL_HOST_USER;
  const user = process.env.EMAIL_HOST_USER;

  const createdAt = new Date(contact.created_at).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  const text = `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone_number || '—'}\nTime: ${createdAt}\n\n${contact.message}`;

  const result = await sendViaGmailAPI({
    to: recipient,
    from: `"Portfolio Contact" <${user}>`,
    subject: `✦ Portfolio Contact: ${contact.name}`,
    text,
    html: buildNotificationHtml(contact, createdAt),
  });

  console.log(`[EMAIL] Notification sent via Gmail API for message #${contact.id} (ID: ${result.id})`);
  return result;
}

async function sendAutoReply(contact) {
  const user = process.env.EMAIL_HOST_USER;

  const text = `Hi ${contact.name},\n\nThank you for getting in touch through my portfolio. I've received your message and will get back to you as soon as possible — usually within 24-48 hours.\n\nYour message:\n"${contact.message}"\n\nBest regards,\nAnirudha Basu Thakur`;

  const result = await sendViaGmailAPI({
    to: contact.email,
    from: `"Anirudha Basu Thakur" <${user}>`,
    subject: `Thanks for reaching out, ${contact.name}!`,
    text,
    html: buildAutoReplyHtml(contact),
  });

  console.log(`[EMAIL] Auto-reply sent via Gmail API to ${contact.email} (ID: ${result.id})`);
  return result;
}

module.exports = { sendViaGmailAPI, sendNotification, sendAutoReply };
