const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('AdConnect API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Export app LAST
module.exports = app;
