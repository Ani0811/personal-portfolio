const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/connection');
const { authMiddleware, signToken } = require('../middleware/auth');

const router = express.Router();

// ---- Login ----
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username],
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken({ id: user.id, username: user.username });
    return res.json({ success: true, token, username: user.username });
  } catch (err) {
    console.error('[AUTH]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---- All routes below require auth ----
router.use(authMiddleware);

// ---- List messages ----
router.get('/contact-messages', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC',
    );
    return res.json({ success: true, count: rows.length, results: rows });
  } catch (err) {
    console.error('[ADMIN]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---- Get single message ----
router.get('/contact-messages/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[ADMIN]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---- Update message (mark read, etc.) ----
router.put('/contact-messages/:id', async (req, res) => {
  const { is_read } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [is_read ? 1 : 0, req.params.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id],
    );
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[ADMIN]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ---- Delete message ----
router.delete('/contact-messages/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM contact_messages WHERE id = ?',
      [req.params.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    console.error('[ADMIN]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
