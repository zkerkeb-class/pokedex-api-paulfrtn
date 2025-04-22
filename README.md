# 📦 Pokedex API – Projet Node.js + MongoDB

Une API RESTful pour manipuler des données Pokémon avec gestion des utilisateurs, authentification JWT, rôles (`admin` /
`user`), **ouverture de boosters**, et **gestion des cartes débloquées**.

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
- Calcule la rareté de chaque Pokémon automatiquement (voir plus bas 👇)
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

## 🌟 Gestion de la rareté

La rareté d’un Pokémon est calculée **à l’import** en fonction de la **somme de ses statistiques de base** :

| Rareté     | Total stats |
|------------|-------------|
| Common     | < 400       |
| Rare       | 400–474     |
| Ultra Rare | 475–524     |
| Legendary  | 525–599     |
| Mythic     | ≥ 600       |

> Cette rareté est **stockée directement dans MongoDB**, et utilisée dans les boosters 🎴

---

## 🎁 Boosters aléatoires

L'utilisateur peut tirer un **booster de 5 Pokémon**. Chaque carte est tirée avec une **probabilité basée sur la rareté
** :

| Position | Rareté possible           | Probabilités                                                                 |
|----------|---------------------------|------------------------------------------------------------------------------|
| 1 à 5    | Mixées avec poids suivant | `Common`: 60%, `Rare`: 25%, `Ultra Rare`: 10%, `Legendary`: 4%, `Mythic`: 1% |

- Le tirage utilise une logique pondérée
- Les cartes sont **directement enregistrées** dans le champ `unlockedPokemons` de l'utilisateur
- Pas besoin d’attendre l’ouverture dans le front 👌

---

## 📌 Endpoints disponibles

### 🔐 Authentification

| Méthode | Route                | Description                      |
|---------|----------------------|----------------------------------|
| POST    | `/api/auth/register` | Inscription utilisateur          |
| POST    | `/api/auth/login`    | Connexion et récupération du JWT |

---

### 🐱 Pokémon

| Méthode | Route                      | Description                                        |
|---------|----------------------------|----------------------------------------------------|
| GET     | `/api/pokemons`            | Liste complète des pokémons                        |
| GET     | `/api/pokemons/page/:n`    | Pokémons paginés par 10                            |
| GET     | `/api/pokemons/id/:id`     | Détails d’un pokémon par ID                        |
| GET     | `/api/pokemons/name/:name` | Rechercher un pokémon par nom                      |
| GET     | `/api/pokemons/type/:type` | Rechercher par type                                |
| GET     | `/api/pokemons/search`     | Rechercher par nom + types (`searchTerm`, `types`) |
| POST    | `/api/pokemons`            | Ajouter un pokémon (auth requis)                   |
| PUT     | `/api/pokemons/id/:id`     | Modifier un pokémon (auth requis)                  |
| DELETE  | `/api/pokemons/id/:id`     | Supprimer un pokémon (admin uniquement)            |

---

### 🃏 Boosters & cartes débloquées

| Méthode | Route                    | Description                                                                             |
|---------|--------------------------|-----------------------------------------------------------------------------------------|
| GET     | `/api/pokemons/booster`  | Tire un booster de 5 cartes aléatoires (auth requis). Mise à jour de `unlockedPokemons` |
| GET     | `/api/pokemons/unlocked` | Retourne tous les Pokémon que l’utilisateur a déjà débloqué (auth requis)               |

---

## ✅ Fonctionnalités techniques couvertes

- Node.js avec Express.js
- MongoDB avec Mongoose
- Hachage des mots de passe avec bcryptjs
- Authentification JWT avec jsonwebtoken
- Middleware de vérification et contrôle des rôles
- Système de rareté automatique des Pokémon
- Tirage pondéré pour boosters
- Système de cartes débloquées utilisateur
- Endpoints RESTful compatibles avec le front

---

## 📊 Améliorations futures possibles

- [ ] Ajout de tests unitaires
- [ ] Documentation Swagger
- [ ] Téléversement d’images
- [ ] Réinitialisation du pokedex utilisateur
- [ ] Booster à thème (type ou génération)

---

## 📄 Licence

Projet réalisé à but pédagogique.  
Feel free to fork & improve 👨‍💻:)