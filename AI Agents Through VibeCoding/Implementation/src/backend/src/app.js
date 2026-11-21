const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Intelligent Test Plan API', timestamp: new Date().toISOString() });
});

// Serve frontend build if present
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexFile = path.join(publicDir, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).send('Intelligent Test Plan API running.');
    }
  });
});

module.exports = app;
