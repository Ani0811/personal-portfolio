// SQL Queries separated from application logic

const queries = {
  // Schema creation
  createContactTable: `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      phone_number VARCHAR(30) DEFAULT '',
      email        VARCHAR(254) NOT NULL,
      message      TEXT NOT NULL,
      is_read      BOOLEAN DEFAULT FALSE,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

  // Contact Message Operations
  createContact: `
    INSERT INTO contact_messages (name, email, message, phone_number) 
    VALUES (?, ?, ?, ?)
  `,
  findContactById: `
    SELECT * FROM contact_messages WHERE id = ?
  `,
  findAllContacts: `
    SELECT * FROM contact_messages ORDER BY created_at DESC
  `,
  updateContactReadStatus: `
    UPDATE contact_messages SET is_read = ? WHERE id = ?
  `,
  deleteContactById: `
    DELETE FROM contact_messages WHERE id = ?
  `,
};

module.exports = queries;
