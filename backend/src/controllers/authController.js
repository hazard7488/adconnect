const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, hashedPassword, role], (err) => {
    if (err) {
      console.error('Signup error:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'User already exists' });
      }

      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ message: 'Signup successful' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  });
};
