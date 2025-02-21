const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import routes
const relatoriosRoutes = require('./routes/relatorios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool(config[process.env.NODE_ENV || 'development']);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Routes
app.use('/api/relatorios', relatoriosRoutes);

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Routes
app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM employees');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/employees', authenticateToken, async (req, res) => {
  try {
    const employee = req.body;
    const [result] = await pool.execute(
      'INSERT INTO employees SET ?',
      [employee]
    );
    res.status(201).json({ id: result.insertId, ...employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Events Routes
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Salary Routes
app.get('/api/salary-records', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM salary_records');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Time Bank Routes
app.get('/api/time-bank', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM time_bank_records');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});