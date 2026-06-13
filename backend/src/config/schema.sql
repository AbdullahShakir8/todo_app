-- Run this file once to set up your database
-- Command: mysql -u root -p < src/config/schema.sql

CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(150)        NOT NULL UNIQUE,
  password   VARCHAR(255)        NOT NULL,  -- bcrypt hash, never plain text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos table (belongs to a user via foreign key)
CREATE TABLE IF NOT EXISTS todos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  priority    ENUM('low','medium','high') DEFAULT 'medium',
  completed   BOOLEAN      DEFAULT FALSE,
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key: deleting a user deletes their todos too
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  -- Index speeds up queries that filter by user_id
  INDEX idx_user_id (user_id)
);
