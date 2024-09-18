const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'Ganeshs-MacBook-Air.local',
  user: 'root',
  password: '12345678', // Replace with your MySQL password
  database: 'userdb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// JWT Secret Key
const jwtSecret = 'jwtsecret'; // Replace with a more secure key in production

// Register a new user
app.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.status(201).json({ message: 'User registered successfully', id: result.insertId });
    });
  });
});

// User login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, jwtSecret);
    console.log(token);

    res.json({ message: 'Login successful', token });
  });
});

app.put('/users/update', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  // Hash password if the password is being updated
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Check if at least one field is provided
  if (!name && !email && !password) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  // Build the query dynamically to update only provided fields
  let query = 'UPDATE users SET ';
  let fields = [];
  let values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (hashedPassword) {
    fields.push('password = ?');
    values.push(hashedPassword);
  }

  query += fields.join(', ') + ' WHERE id = ?';
  values.push(userId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database error: ', err); // Debug: Log the error details
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});



// Protected route - get user profile
app.get('/users/profile', verifyToken, (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  // Fetch user profile from the database
  const query = 'SELECT id, name, email, password FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]); // Return the user profile
  });
});

// Verify JWT middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded; // Attach decoded user info (e.g., user ID) to request
    next(); // Proceed to the next middleware or route handler
  });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
