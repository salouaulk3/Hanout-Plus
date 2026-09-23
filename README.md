# 🏪 HANOT+ (Hanout-Plus)
### Solution Numérique & Carnet de Crédit Intelligent pour Commerçants

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-0.86-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Platform](https://img.shields.io/badge/Platform-iOS_%7C_Android_%7C_Web-blue?style=for-the-badge)]()

</div>

---

## 📖 Présentation

**HANOT+** est une application moderne conçue pour digitaliser et simplifier la gestion quotidienne des commerçants de proximité (épiceries, supérettes, artisans). 

Elle remplace avantageusement le carnet papier traditionnel (« karnet ») en offrant un suivi précis, transparent et en temps réel des créances clients, des encaissements et de la santé financière du commerce.

---

## ✨ Fonctionnalités Clés

- 💳 **Carnet de Crédit Numérique (Dettes)** : Enregistrement instantané des ventes à crédit par client avec date et libellé.
- 💰 **Gestion des Règlements (Paiements)** : Suivi des paiements partiels ou complets avec mise à jour immédiate du solde débiteur.
- 📊 **Tableau de Bord Financier en Temps Réel** : Indicateurs clés (Total crédits octroyés, total encaissé, balance globale).
- ⚡ **Historique d'Activité Récent** : Flux chronologique des dernières transactions (achats à crédit et versements).
- 📱 **Expérience Multiplateforme Fluide** : Fonctionne nativement sur mobile (Android, iOS) et sur le web (Chrome, Edge, Safari) via Expo Router.
- 🛡️ **Architecture Hybride & Mode Fallback** : Données de démonstration et cache local inclus garantissant une disponibilité permanente même hors-ligne.

---

## 🏗️ Architecture Technique

```
HANOTI-/
├── backend/                  # Serveur API REST (Node.js / Express)
│   ├── server.js             # Routes API, authentification JWT, contrôleurs
│   ├── database.sql          # Schéma de la base de données relationnelle
│   └── package.json          # Dépendances backend (Express, MySQL2, Cors, Bcrypt)
│
└── frontend/                 # Application Mobile & Web (Expo / React Native)
    ├── src/
    │   ├── app/              # Navigation par fichiers (Expo Router)
    │   │   ├── (tabs)/       # Onglets principaux (Accueil, Ajouter, Profil)
    │   │   │   ├── dashboard.tsx  # Dashboard & statistiques
    │   │   │   ├── add.tsx        # Saisie rapide des transactions
    │   │   │   └── profile.tsx    # Profil commerçant et réglages
    │   │   ├── login.tsx     # Écran de connexion sécurisé
    │   │   └── _layout.tsx   # Conteneur racine & gestion des thèmes
    │   ├── components/       # Composants graphiques réutilisables (app-tabs, icônes)
    │   ├── context/          # Context API (AuthContext, sessions)
    │   └── services/         # Client API & gestion des états de secours (fallback)
    ├── app.json              # Configuration Expo & métadonnées
    └── package.json          # Dépendances frontend
```

---

## 🛠️ Stack Technologique

| Domaine | Technologies |
|---|---|
| **Mobile & Web UI** | React Native, Expo 57, Expo Router, React 19 |
| **Langages** | TypeScript, JavaScript (Node.js ES6+), SQL |
| **Backend API** | Express.js, Node.js, REST Architecture |
| **Sécurité** | JSON Web Tokens (JWT), Bcrypt password hashing |
| **Base de données** | MySQL / MariaDB (avec couche de fallback intégrée) |
| **Styling** | Vanilla CSS, StyleSheet optimisé, Glassmorphism, animations fluides |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Git](https://git-scm.com/)

### 1. Cloner le dépôt
```bash
git clone https://github.com/salouaulk3/Hanout-Plus.git
cd Hanout-Plus
```

### 2. Démarrer le Backend
```bash
cd backend
npm install
npm start
# Le serveur démarre sur http://localhost:3000
```

### 3. Démarrer le Frontend (Mobile & Web)
Dans un second terminal :
```bash
cd frontend
npm install
npx expo start --web
# L'application s'ouvre sur http://localhost:8081
```

---

## 👤 Auteur & Maintenance

Développé avec passion par **[Saloua](https://github.com/salouaulk3)**.

- GitHub : [@salouaulk3](https://github.com/salouaulk3)
- Projet : [HANOT+ (Hanout-Plus)](https://github.com/salouaulk3/Hanout-Plus)

---

<div align="center">
  <sub>⭐ N'hésitez pas à laisser une étoile sur le dépôt si ce projet vous plaît !</sub>
</div>
