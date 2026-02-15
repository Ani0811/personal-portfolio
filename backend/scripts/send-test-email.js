/**
 * Quick one-shot script to verify SMTP credentials work.
 * Usage:  node scripts/send-test-email.js
 */
require('dotenv').config();

const { sendNotification, sendAutoReply } = require('../src/services/email');
const { ContactMessage } = require('../src/db/queries');

const fakePayload = {
  name: 'Test User',
  email: process.env.CONTACT_NOTIFICATION_EMAIL || process.env.EMAIL_HOST_USER,
  phone_number: '+91 98765 43210',
  message: 'This is a test message sent from the portfolio backend to verify SMTP credentials and DB persistence.',
};

(async () => {
  try {
    // Persist to DB so contact_messages table reflects the test
    console.log('Inserting test contact into database...');
    const saved = await ContactMessage.create(fakePayload);
    console.log('✓ Saved contact id=' + saved.id);

    console.log('Sending notification email...');
    await sendNotification(saved);
    console.log('✓ Notification email sent!');

    console.log('Sending auto-reply email...');
    await sendAutoReply(saved);
    console.log('✓ Auto-reply email sent!');

    console.log('\nAll done — DB updated and both emails sent.');
  } catch (err) {
    console.error('✗ Failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
})();
