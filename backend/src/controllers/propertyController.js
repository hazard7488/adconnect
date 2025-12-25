const db = require('../config/db');

exports.addProperty = (req, res) => {
  const {
    title, property_type, description,
    city, area, traffic, footfall,
    width, height, price, price_type,
    latitude, longitude
  } = req.body;

  const owner_id = req.user.id;

  const sql = `
    INSERT INTO properties
    (owner_id, title, property_type, description,
     city, area, traffic, footfall,
     width, height, price, price_type,
     latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    owner_id, title, property_type, description,
    city, area, traffic, footfall,
    width, height, price, price_type,
    latitude, longitude
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding property' });
    }
    res.json({ message: 'Property added successfully' });
  });
};

exports.getAllProperties = (req, res) => {
  // Increment impressions
  db.query(
    `UPDATE properties SET impressions = impressions + 1`,
    () => {}
  );

  db.query(
    `SELECT id, title, city, area, price,
            is_featured, views, impressions
     FROM properties
     ORDER BY is_featured DESC, id DESC`,
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(result);
    }
  );
};

exports.incrementView = (req, res) => {
  const { id } = req.params;

  db.query(
    `UPDATE properties SET views = views + 1 WHERE id=?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ message: 'View update failed' });
      res.json({ message: 'View counted' });
    }
  );
};
