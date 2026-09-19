CREATE DATABASE IF NOT EXISTS hanoti_db;
USE hanoti_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  abonnement VARCHAR(50) DEFAULT 'standar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin account
-- password is 'admin123'
INSERT INTO users (email, password, role, abonnement) 
VALUES ('admin@gmail.com', '$2b$10$m0PQqxn9FRjiZk35tt9tsuhOgOti9cytaMRmEkowl8NHeb9eDz84W', 'user', 'standar');
