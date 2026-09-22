CREATE DATABASE IF NOT EXISTS hanoti_db;
USE hanoti_db;

-- Table des utilisateurs (commerçants)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Commerçant',
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  abonnement VARCHAR(50) DEFAULT 'standar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  credit DECIMAL(10, 2) DEFAULT 0.00,
  total_paid DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'actif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des activités / transactions (paiements et crédits)
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT 1,
  client_id INT NULL,
  client_name VARCHAR(255) NOT NULL,
  type ENUM('paiement', 'credit', 'nouveau_client') NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0.00,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Compte administrateur / démo par défaut (mot de passe: 'admin123')
INSERT INTO users (id, name, email, password, role, abonnement) 
VALUES (1, 'Sami Commerçant', 'admin@gmail.com', '$2b$10$m0PQqxn9FRjiZk35tt9tsuhOgOti9cytaMRmEkowl8NHeb9eDz84W', 'admin', 'pro')
ON DUPLICATE KEY UPDATE name = 'Sami Commerçant';

-- Données de démonstration pour les clients
INSERT INTO clients (user_id, name, phone, credit, total_paid, status, created_at) VALUES
(1, 'Mohamed Amrani', '06 61 23 45 67', 4500.00, 18000.00, 'actif', NOW() - INTERVAL 1 DAY),
(1, 'Amina Benali', '07 72 34 56 78', 0.00, 12500.00, 'actif', NOW() - INTERVAL 2 DAY),
(1, 'Karim Zeroual', '05 50 12 34 56', 8200.00, 24000.00, 'actif', NOW() - INTERVAL 3 DAY),
(1, 'Fatima Zohra', '06 63 98 76 54', 1500.00, 9500.00, 'actif', NOW() - INTERVAL 4 DAY),
(1, 'Yassine Mansouri', '07 70 88 99 00', 3200.00, 15300.00, 'actif', NOW() - INTERVAL 5 DAY);

-- Données de démonstration pour les activités
INSERT INTO activities (user_id, client_id, client_name, type, amount, description, created_at) VALUES
(1, 1, 'Mohamed Amrani', 'paiement', 3000.00, 'Règlement partiel en espèces', NOW() - INTERVAL 25 MINUTE),
(1, 3, 'Karim Zeroual', 'credit', 2500.00, 'Achat marchandises à crédit', NOW() - INTERVAL 2 HOUR),
(1, 2, 'Amina Benali', 'paiement', 4500.00, 'Solde de tout compte', NOW() - INTERVAL 5 HOUR),
(1, 4, 'Fatima Zohra', 'credit', 1500.00, 'Produits alimentaires', NOW() - INTERVAL 1 DAY),
(1, 5, 'Yassine Mansouri', 'nouveau_client', 0.00, 'Création du compte client', NOW() - INTERVAL 2 DAY);
