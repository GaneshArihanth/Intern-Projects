const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'Ganeshs-MacBook-Air.local',
  user: 'root',
  password: '12345678', 
  database: 'userdb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

const jwtSecret = 'jwtsecretkey'; 

app.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.status(201).json({ message: 'User registered successfully', id: result.insertId });
    });
  });
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, jwtSecret);
    console.log(token);

    res.json({ message: 'Login successful', token });
  });
});

app.put('/users/update', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  if (!name && !email && !password) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

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
      console.error('Database error: ', err); 
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});



app.get('/users/profile', verifyToken, (req, res) => {
  const userId = req.user.id; 

  const query = 'SELECT id, name, email, password FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]); 
  });
});

app.delete('/users/delete', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = 'DELETE FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
});


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader; 

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded; 
    next(); 
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
