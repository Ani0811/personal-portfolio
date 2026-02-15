const express = require('express');
const { body, validationResult } = require('express-validator');
const { ContactMessage } = require('../db/queries');
const { sendNotification, sendAutoReply } = require('../services/email');

const router = express.Router();

const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters.'),
  body('email')
    .trim()
    .isEmail()
    .isLength({ max: 254 })
    .withMessage('A valid email is required.'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters.'),
  body('phone_number')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone number must not exceed 30 characters.'),
];

router.post('/contact/', contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = {};
    errors.array().forEach((e) => { fieldErrors[e.path] = e.msg; });
    return res.status(400).json({ success: false, errors: fieldErrors });
  }

  const { name, email, message, phone_number = '' } = req.body;

  try {
    const saved = await ContactMessage.create({ name, email, message, phone_number });

    sendNotification(saved).catch((err) => {
      console.error('[EMAIL] Notification failed:', err.message);
    });

    sendAutoReply(saved).catch((err) => {
      console.error('[EMAIL] Auto-reply failed:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been received successfully. We will get back to you soon!',
      data: {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        phone_number: saved.phone_number,
        message: saved.message,
        created_at: saved.created_at,
        is_read: saved.is_read,
      },
    });
  } catch (err) {
    console.error('[CONTACT] Save failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your message. Please try again later.',
    });
  }
});

module.exports = router;
