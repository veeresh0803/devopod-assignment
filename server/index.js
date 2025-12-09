const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after verifying database connection
(async () => {
  try {
    if (process.env.SKIP_DB_CHECK && process.env.SKIP_DB_CHECK.toLowerCase() === 'true') {
      console.warn('SKIP_DB_CHECK=true — skipping database connectivity check.');
    } else if (db && typeof db.testConnection === 'function') {
      await db.testConnection();
      console.log('✓ Database connection OK');
    } else {
      console.warn('Database test function not available; continuing without explicit DB check.');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Database connection failed. Please ensure MySQL is running and .env has correct DB settings.');
    console.error(err && err.message ? err.message : err);
    if (process.env.SKIP_DB_CHECK && process.env.SKIP_DB_CHECK.toLowerCase() === 'true') {
      console.warn('SKIP_DB_CHECK is set — ignoring DB connection failure and continuing to start server.');
      app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      });
    } else {
      process.exit(1);
    }
  }
})();
