# 📦 Pokedex API – Projet Node.js + MongoDB

Une API RESTful pour manipuler des données Pokémon avec gestion des utilisateurs, authentification JWT, et rôles (
`admin` / `user`).

---

## 🚀 Cloner le projet

```bash
git clone git@github.com:zkerkeb-class/pokedex-api-paulfrtn.git
cd pokedex-api-paulfrtn
```

---

## 📆 Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

🛡️ **Important** : remplacez la valeur de `JWT_SECRET` par une chaîne **forte et secrète**  
(exemple : `JWT_SECRET=UnSecretUltraComplexe123!@#`)

---

## 💄 Initialiser la base de données

Ce script :

- Supprime les anciens pokémons et utilisateurs
- Réimporte tous les pokémons depuis `pokemons.json`
- Crée deux utilisateurs : un admin et un user

```bash
npm run import-data
```

### 👤 Utilisateurs créés automatiquement

| Rôle  | Email          | Mot de passe |
|-------|----------------|--------------|
| admin | admin@poke.com | admin123     |
| user  | user@poke.com  | user123      |

---

## 🧪 Lancer le serveur en mode développement

```bash
npm run dev
```

Le serveur démarre par défaut sur :  
[http://localhost:3000](http://localhost:3000)

---

## 📌 Endpoints disponibles

### 🔐 Authentification

| Méthode | Route                | Description                      |
|---------|----------------------|----------------------------------|
| POST    | `/api/auth/register` | Inscription utilisateur          |
| POST    | `/api/auth/login`    | Connexion et récupération du JWT |

### 🐱 Pokémon

| Méthode | Route                      | Description                               |
|---------|----------------------------|-------------------------------------------|
| GET     | `/api/pokemons`            | Liste complète des pokémons               |
| GET     | `/api/pokemons/page/:n`    | Pokémons paginés par 10                   |
| GET     | `/api/pokemons/id/:id`     | Détails d’un pokémon par ID               |
| GET     | `/api/pokemons/name/:name` | Rechercher un pokémon par nom             |
| GET     | `/api/pokemons/type/:type` | Rechercher par type                       |
| GET     | `/api/pokemons/search`     | Rechercher par nom + types (query params) |
| POST    | `/api/pokemons`            | Ajouter un pokémon (auth requis)          |
| PUT     | `/api/pokemons/:id`        | Modifier un pokémon (auth requis)         |
| DELETE  | `/api/pokemons/:id`        | Supprimer un pokémon (admin uniquement)   |

---

## ✅ Fonctionnalités techniques couvertes

- Node.js avec Express.js
- MongoDB avec Mongoose
- Hachage des mots de passe avec bcryptjs
- Authentification JWT avec jsonwebtoken
- Middleware de vérification et contrôle des rôles
- Validation de schéma dans Mongoose
- Endpoints RESTful compatibles avec les clients existants

---

## 📊 Améliorations futures possibles

- [ ] Ajout de tests unitaires
- [ ] Documentation Swagger
- [ ] Téléversement d’images
- [ ] Pagination améliorée

---

## 📄 Licence

Projet réalisé à but pédagogique.  
Feel free to fork & improve 👨‍💻
