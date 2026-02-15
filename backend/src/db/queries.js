const { pool } = require('./connection');
const sql = require('../sql/queries');

const ContactMessage = {
  async create({ name, email, message, phone_number }) {
    const [result] = await pool.execute(
      sql.createContact,
      [name, email, message, phone_number || ''],
    );
    return ContactMessage.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      sql.findContactById,
      [id],
    );
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.execute(
      sql.findAllContacts,
    );
    return rows;
  },

  async updateReadStatus(id, isRead) {
    const [result] = await pool.execute(
      sql.updateContactReadStatus,
      [isRead ? 1 : 0, id],
    );
    if (result.affectedRows === 0) return null;
    return ContactMessage.findById(id);
  },

  async deleteById(id) {
    const [result] = await pool.execute(
      sql.deleteContactById,
      [id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = { ContactMessage };

