/**
 * Mock Authentication Module
 * 
 * This module provides in-memory user storage for testing without a database.
 * It uses the same API as the real authController but stores users in memory.
 * 
 * Users pre-loaded from USER_CREDENTIALS.txt (matching the frontend expectations).
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store
let users = [];

// Pre-populate with test users from USER_CREDENTIALS.txt
async function initializeMockUsers() {
  const testUsers = [
    {
      id: 1,
      username: 'john_manager',
      email: 'john.manager@construction.com',
      password: 'Manager@2024!',
      role: 'Manager',
    },
    {
      id: 2,
      username: 'sarah_accountant',
      email: 'sarah.accountant@construction.com',
      password: 'Sarah@2024!',
      role: 'Manager',
    },
    {
      id: 3,
      username: 'mike_supervisor',
      email: 'mike.supervisor@construction.com',
      password: 'Mike@2024!',
      role: 'Manager',
    },
    {
      id: 4,
      username: 'emma_finance',
      email: 'emma.finance@construction.com',
      password: 'Emma@2024!',
      role: 'Manager',
    },
    {
      id: 5,
      username: 'david_ops',
      email: 'david.ops@construction.com',
      password: 'David@2024!',
      role: 'Manager',
    },
    {
      id: 6,
      username: 'admin',
      email: 'admin@construction.com',
      password: 'password',
      role: 'Admin',
    },
  ];

  // Hash all passwords
  for (const user of testUsers) {
    user.password_hash = await bcrypt.hash(user.password, 10);
    delete user.password; // remove plaintext password
  }

  users = testUsers;
  console.log('✓ Mock auth initialized with', users.length, 'test users');
}

// Initialize on load
initializeMockUsers().catch(console.error);

// Register a new user (mock version)
async function register(req, res) {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password_hash: hashedPassword,
      role: role || 'user',
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
}

// Login user (mock version)
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_secret_jwt_key_here_change_this_in_production',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
}

// Get current user (mock version)
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id; // set by auth middleware
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
