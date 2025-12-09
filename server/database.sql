-- Create the database
CREATE DATABASE IF NOT EXISTS construction_erp;
USE construction_erp;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  budget DECIMAL(15, 2) NOT NULL,
  spent DECIMAL(15, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Accounts table (General Ledger)
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_code VARCHAR(50) NOT NULL UNIQUE,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50), -- Asset, Liability, Revenue, Expense
  balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data insertion (optional)
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', '$2a$10$K8wnVlL7H.5l1B2C3D4E5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo', 'admin@construction.com', 'admin'),
('manager', '$2a$10$K8wnVlL7H.5l1B2C3D4E5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo', 'manager@construction.com', 'manager');

-- Default accounts
INSERT INTO accounts (account_code, account_name, account_type, balance) VALUES
('1000', 'Cash', 'Asset', 50000.00),
('1200', 'Accounts Receivable', 'Asset', 0.00),
('2000', 'Accounts Payable', 'Liability', 0.00),
('4000', 'Revenue', 'Revenue', 0.00),
('5000', 'Project Expenses', 'Expense', 0.00);
