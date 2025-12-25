const db = require('../config/db');

exports.getUsers = (req, res) => {
  db.query(
    'SELECT id, name, email, role FROM users',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
};

exports.getProperties = (req, res) => {
  db.query(
    'SELECT * FROM properties',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
};

exports.featureProperty = (req, res) => {
  const { id, featured } = req.body;

  if (typeof featured === 'undefined') {
    return res.status(400).json({ message: 'featured value required' });
  }

  db.query(
    'UPDATE properties SET is_featured=? WHERE id=?',
    [featured, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ message: 'Property feature updated' });
    }
  );
};

exports.getRequests = (req, res) => {
  db.query(
    'SELECT * FROM requests',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
};

exports.getPayments = (req, res) => {
  db.query(
    'SELECT * FROM payments',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
};
