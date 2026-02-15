require('dotenv').config();
const { pool } = require('./connection');
const sql = require('../sql/queries');

async function setupDatabase() {
  console.log('Running database setup...');

  await pool.query(sql.createContactTable);
  console.log('  ✓ contact_messages table ready');

  console.log('Database setup complete.\n');
}

if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { setupDatabase };
