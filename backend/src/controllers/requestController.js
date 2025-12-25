const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.sendRequest = (req, res) => {
  try {
    console.log('Incoming request body:', req.body);

    const token = req.headers.authorization;
    console.log('Token received:', token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const agency_id = decoded.id;
    const { property_id } = req.body;

    if (!property_id) {
      return res.status(400).json({ message: 'Property ID missing' });
    }

    const sql = `
      INSERT INTO requests (property_id, agency_id)
      VALUES (?, ?)
    `;

    db.query(sql, [property_id, agency_id], (err) => {
      if (err) {
        console.error('DB error while sending request:', err);
        return res.status(500).json({ message: 'Request failed', error: err.code });
      }

      res.json({ message: 'Request sent successfully' });
    });
  } catch (err) {
    console.error('JWT / Server error:', err);
    res.status(500).json({ message: 'Invalid token' });
  }
};
exports.getOwnerRequests = (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner_id = decoded.id;

    const sql = `
      SELECT r.id, r.status, p.title, u.name AS agency_name
      FROM requests r
      JOIN properties p ON r.property_id = p.id
      JOIN users u ON r.agency_id = u.id
      WHERE p.owner_id = ?
    `;

    db.query(sql, [owner_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching requests' });
      }
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
exports.updateRequestStatus = (req, res) => {
  const { request_id, status } = req.body;

  const sql = `
    UPDATE requests
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, request_id], (err) => {
    if (err) return res.status(500).json({ message: 'Update failed' });
    res.json({ message: 'Request updated successfully' });
  });
};
