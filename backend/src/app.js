require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AdConnect API is running');
});

module.exports = app;
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const propertyRoutes = require('./src/routes/propertyRoutes');
app.use('/api/properties', propertyRoutes);
const requestRoutes = require('./src/routes/requestRoutes');
app.use('/api/requests', requestRoutes);
const paymentRoutes = require('./src/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

