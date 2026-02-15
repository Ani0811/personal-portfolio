const { pool } = require('./connection');
const bcrypt = require('bcryptjs');

async function migrate() {
  console.log('Running migrations...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      phone_number VARCHAR(30) DEFAULT '',
      email       VARCHAR(254) NOT NULL,
      message     TEXT NOT NULL,
      is_read     BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✓ contact_messages table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      username      VARCHAR(150) NOT NULL UNIQUE,
      email         VARCHAR(254) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✓ admin_users table ready');

  const adminUser = process.env.ADMIN_USERNAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (adminUser && adminEmail && adminPass) {
    const [rows] = await pool.query(
      'SELECT id FROM admin_users WHERE username = ?',
      [adminUser],
    );
    if (rows.length === 0) {
      const hash = await bcrypt.hash(adminPass, 12);
      await pool.query(
        'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
        [adminUser, adminEmail, hash],
      );
      console.log(`  ✓ Admin user "${adminUser}" created`);
    } else {
      console.log(`  ✓ Admin user "${adminUser}" already exists`);
    }
  }

  console.log('Migrations complete.\n');
}

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { migrate };
