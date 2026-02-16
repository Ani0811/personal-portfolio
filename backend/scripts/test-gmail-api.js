#!/usr/bin/env node
/**
 * Test Gmail API direct sending (not SMTP).
 * Usage: node scripts/test-gmail-api.js
 */
require('dotenv').config();
const { sendViaGmailAPI } = require('../src/services/email-gmail-api');

(async () => {
  try {
    const user = process.env.EMAIL_HOST_USER;
    const to = process.env.CONTACT_NOTIFICATION_EMAIL || user;

    console.log('Sending test email via Gmail API...');
    console.log('From:', user);
    console.log('To:', to);

    const result = await sendViaGmailAPI({
      to,
      from: `"Portfolio Test" <${user}>`,
      subject: '✦ Test Email via Gmail API (OAuth2)',
      html: `
        <html>
          <body>
            <h2>Success!</h2>
            <p>This email was sent using <strong>Gmail API</strong> with OAuth2 (not SMTP).</p>
            <p>This method works reliably with OAuth Playground tokens.</p>
          </body>
        </html>
      `,
    });

    console.log('✓ Email sent successfully via Gmail API!');
    console.log('Message ID:', result.id);
    process.exit(0);
  } catch (err) {
    console.error('✗ Failed:', err.message || err);
    process.exit(1);
  }
})();
