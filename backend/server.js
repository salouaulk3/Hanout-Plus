const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
let isDbConnected = false;
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Adjust to your local XAMPP/MySQL username
  password: '', // Adjust to your local XAMPP/MySQL password
  database: 'hanoti_db'
});

db.connect((err) => {
  if (err) {
    console.warn('⚠️ Warning: Could not connect to MySQL database. Server will use stateful mock fallback data for development/demo.');
    isDbConnected = false;
  } else {
    console.log('✅ Connected to MySQL database hanoti_db');
    isDbConnected = true;
  }
});

const JWT_SECRET = 'hanoti_secure_key_12345';

// Données de secours réalistes et dynamiques (Fallback) si MySQL n'est pas lancé
let fallbackData = {
  stats: {
    totalClients: 5,
    totalPaid: 64000,
    totalCredit: 17400
  },
  recentActivities: [
    {
      id: 1,
      client_id: 1,
      client_name: 'Mohamed Amrani',
      type: 'paiement',
      amount: 3000,
      description: 'Règlement partiel en espèces',
      created_at: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: 2,
      client_id: 3,
      client_name: 'Karim Zeroual',
      type: 'credit',
      amount: 2500,
      description: 'Achat marchandises à crédit',
      created_at: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: 3,
      client_id: 2,
      client_name: 'Amina Benali',
      type: 'paiement',
      amount: 4500,
      description: 'Solde de tout compte',
      created_at: new Date(Date.now() - 5 * 3600000).toISOString()
    },
    {
      id: 4,
      client_id: 4,
      client_name: 'Fatima Zohra',
      type: 'credit',
      amount: 1500,
      description: 'Produits d’épicerie',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: 5,
      client_id: 5,
      client_name: 'Yassine Mansouri',
      type: 'nouveau_client',
      amount: 0,
      description: 'Nouveau client enregistré',
      created_at: new Date(Date.now() - 48 * 3600000).toISOString()
    }
  ],
  recentClients: [
    {
      id: 1,
      name: 'Mohamed Amrani',
      phone: '06 61 23 45 67',
      credit: 4500,
      total_paid: 18000,
      status: 'actif',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: 2,
      name: 'Amina Benali',
      phone: '07 72 34 56 78',
      credit: 0,
      total_paid: 12500,
      status: 'actif',
      created_at: new Date(Date.now() - 48 * 3600000).toISOString()
    },
    {
      id: 3,
      name: 'Karim Zeroual',
      phone: '05 50 12 34 56',
      credit: 8200,
      total_paid: 24000,
      status: 'actif',
      created_at: new Date(Date.now() - 72 * 3600000).toISOString()
    },
    {
      id: 4,
      name: 'Fatima Zohra',
      phone: '06 63 98 76 54',
      credit: 1500,
      total_paid: 9500,
      status: 'actif',
      created_at: new Date(Date.now() - 96 * 3600000).toISOString()
    },
    {
      id: 5,
      name: 'Yassine Mansouri',
      phone: '07 70 88 99 00',
      credit: 3200,
      total_paid: 15300,
      status: 'actif',
      created_at: new Date(Date.now() - 120 * 3600000).toISOString()
    }
  ]
};

// Route: Connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  // Fallback si la base n'est pas connectée
  if (!isDbConnected) {
    if ((email === 'admin@gmail.com' && password === 'admin123') || (email && password)) {
      const mockUser = {
        id: 1,
        name: 'Sami Commerçant',
        email: email || 'admin@gmail.com',
        role: 'admin',
        abonnement: 'pro'
      };
      const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        message: 'Connexion réussie',
        token,
        user: mockUser
      });
    }
  }

  // Find user by email dans MySQL
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur de base de données' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const userName = user.name || user.email.split('@')[0];

    const token = jwt.sign(
      { id: user.id, name: userName, email: user.email, role: user.role, abonnement: user.abonnement }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: userName,
        email: user.email,
        role: user.role,
        abonnement: user.abonnement
      }
    });
  });
});

// Route: Données complètes du Dashboard
app.get('/api/dashboard', async (req, res) => {
  if (!isDbConnected) {
    // Calculer les statistiques en temps réel à partir de fallbackData
    const totalCredit = fallbackData.recentClients.reduce((acc, c) => acc + (Number(c.credit) || 0), 0);
    const totalPaid = fallbackData.recentClients.reduce((acc, c) => acc + (Number(c.total_paid) || 0), 0);
    fallbackData.stats = {
      totalClients: fallbackData.recentClients.length,
      totalPaid,
      totalCredit
    };

    return res.json({
      success: true,
      isDemo: true,
      stats: fallbackData.stats,
      recentActivities: fallbackData.recentActivities.slice(0, 10),
      recentClients: fallbackData.recentClients.slice(0, 5)
    });
  }

  try {
    const statsQuery = `
      SELECT 
        COUNT(id) AS totalClients,
        COALESCE(SUM(credit), 0) AS totalCredit,
        COALESCE(SUM(total_paid), 0) AS totalPaid
      FROM clients
    `;

    const activitiesQuery = `
      SELECT id, client_id, client_name, type, amount, description, created_at 
      FROM activities 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    const clientsQuery = `
      SELECT id, name, phone, credit, total_paid, status, created_at 
      FROM clients 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    db.query(statsQuery, (err1, statsRes) => {
      if (err1) {
        return res.json({ success: true, isDemo: true, ...fallbackData });
      }

      db.query(activitiesQuery, (err2, actRes) => {
        if (err2) {
          return res.json({ success: true, isDemo: true, ...fallbackData });
        }

        db.query(clientsQuery, (err3, clientRes) => {
          if (err3) {
            return res.json({ success: true, isDemo: true, ...fallbackData });
          }

          const stats = statsRes[0] || { totalClients: 0, totalPaid: 0, totalCredit: 0 };
          return res.json({
            success: true,
            isDemo: false,
            stats: {
              totalClients: Number(stats.totalClients) || 0,
              totalPaid: Number(stats.totalPaid) || 0,
              totalCredit: Number(stats.totalCredit) || 0
            },
            recentActivities: actRes || [],
            recentClients: clientRes || []
          });
        });
      });
    });
  } catch (error) {
    console.error('Server error on dashboard endpoint:', error);
    res.json({ success: true, isDemo: true, ...fallbackData });
  }
});

// Route: Liste des clients (avec recherche optionnelle)
app.get('/api/clients', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  const filter = req.query.filter || 'all';

  if (!isDbConnected) {
    let clients = [...fallbackData.recentClients];
    if (search) {
      clients = clients.filter(c => 
        c.name.toLowerCase().includes(search) || 
        (c.phone && c.phone.includes(search))
      );
    }
    if (filter === 'debt') {
      clients = clients.filter(c => c.credit > 0);
    } else if (filter === 'settled') {
      clients = clients.filter(c => c.credit === 0);
    }
    return res.json(clients);
  }

  let query = 'SELECT * FROM clients WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (filter === 'debt') {
    query += ' AND credit > 0';
  } else if (filter === 'settled') {
    query += ' AND credit = 0';
  }
  query += ' ORDER BY created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Route: Créer un client
app.post('/api/clients', (req, res) => {
  const { name, phone, credit } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Le nom du client est obligatoire' });
  }

  const initialCredit = parseFloat(credit) || 0;
  const clientPhone = phone ? phone.trim() : '';

  if (!isDbConnected) {
    const newClient = {
      id: Date.now(),
      name: name.trim(),
      phone: clientPhone,
      credit: initialCredit,
      total_paid: 0,
      status: 'actif',
      created_at: new Date().toISOString()
    };
    fallbackData.recentClients.unshift(newClient);
    fallbackData.stats.totalClients += 1;
    fallbackData.stats.totalCredit += initialCredit;

    // Ajouter activité nouveau client
    fallbackData.recentActivities.unshift({
      id: Date.now() + 1,
      client_id: newClient.id,
      client_name: newClient.name,
      type: 'nouveau_client',
      amount: initialCredit,
      description: initialCredit > 0 ? `Nouveau client avec dette initiale de ${initialCredit} DA` : 'Nouveau client enregistré',
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, client: newClient });
  }

  const query = 'INSERT INTO clients (user_id, name, phone, credit, total_paid, status) VALUES (1, ?, ?, ?, 0.00, "actif")';
  db.query(query, [name.trim(), clientPhone, initialCredit], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const newClientId = result.insertId;
    const newClient = {
      id: newClientId,
      name: name.trim(),
      phone: clientPhone,
      credit: initialCredit,
      total_paid: 0,
      status: 'actif',
      created_at: new Date().toISOString()
    };

    // Si crédit initial > 0, ajouter une trace d'activité
    const actQuery = 'INSERT INTO activities (user_id, client_id, client_name, type, amount, description) VALUES (1, ?, ?, "nouveau_client", ?, ?)';
    db.query(actQuery, [newClientId, newClient.name, initialCredit, initialCredit > 0 ? `Dette initiale: ${initialCredit} DA` : 'Nouveau client'], () => {});

    res.status(201).json({ success: true, client: newClient });
  });
});

// Route: Enregistrer une transaction / mouvement (Paiement ou Crédit)
app.post('/api/transactions', (req, res) => {
  const { client_id, client_name, type, amount, description } = req.body;
  const numAmount = parseFloat(amount);

  if (!client_name || !type || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ message: 'Données de transaction invalides' });
  }

  if (!isDbConnected) {
    const activity = {
      id: Date.now(),
      client_id: client_id || null,
      client_name,
      type, // 'paiement' ou 'credit'
      amount: numAmount,
      description: description || (type === 'paiement' ? 'Paiement reçu' : 'Crédit accordé'),
      created_at: new Date().toISOString()
    };

    fallbackData.recentActivities.unshift(activity);

    // Mettre à jour le client correspondant si trouvé
    const client = fallbackData.recentClients.find(c => (client_id && c.id === client_id) || c.name.toLowerCase() === client_name.toLowerCase());
    if (client) {
      if (type === 'paiement') {
        client.credit = Math.max(0, (client.credit || 0) - numAmount);
        client.total_paid = (client.total_paid || 0) + numAmount;
      } else if (type === 'credit') {
        client.credit = (client.credit || 0) + numAmount;
      }
    }

    return res.status(201).json({ success: true, activity });
  }

  const query = 'INSERT INTO activities (user_id, client_id, client_name, type, amount, description) VALUES (1, ?, ?, ?, ?, ?)';
  db.query(query, [client_id || null, client_name, type, numAmount, description || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Mise à jour de la table clients
    if (client_id) {
      if (type === 'paiement') {
        db.query('UPDATE clients SET credit = GREATEST(0, credit - ?), total_paid = total_paid + ? WHERE id = ?', [numAmount, numAmount, client_id], () => {});
      } else if (type === 'credit') {
        db.query('UPDATE clients SET credit = credit + ? WHERE id = ?', [numAmount, client_id], () => {});
      }
    }

    const newActivity = {
      id: result.insertId,
      client_id,
      client_name,
      type,
      amount: numAmount,
      description,
      created_at: new Date().toISOString()
    };

    res.status(201).json({ success: true, activity: newActivity });
  });
});

// Route: Liste des activités
app.get('/api/activities', (req, res) => {
  if (!isDbConnected) {
    return res.json(fallbackData.recentActivities);
  }
  db.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 50', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Route: Supprimer un client
app.delete('/api/clients/:id', (req, res) => {
  const clientId = parseInt(req.params.id);

  if (!isDbConnected) {
    fallbackData.recentClients = fallbackData.recentClients.filter(c => c.id !== clientId);
    return res.json({ success: true, message: 'Client supprimé' });
  }

  db.query('DELETE FROM clients WHERE id = ?', [clientId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Client supprimé' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
