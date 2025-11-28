# Architecture du Projet Blog

Ce document décrit l'architecture technique de l'application de blog. Le projet est construit avec **React**, **TypeScript** et **Vite**.

## Structure des Dossiers (`src/`)

Le code source est organisé de manière modulaire pour séparer les responsabilités.

### 1. `components/` (Composants Réutilisables)
Ce dossier contient les briques UI de l'application. Ce sont des morceaux d'interface qui peuvent être réutilisés.
*   **`articles/`** : Composants spécifiques aux articles.
    *   `ArticleCard.tsx` : Affiche un résumé d'un article (titre, auteur, likes) dans une liste. Gère aussi le bouton "J'aime" directement sur la carte.
    *   `ArticleList.tsx` : Gère l'affichage de la liste des articles et la barre de recherche.
    *   `ArticleForm.tsx` : Le formulaire pour créer un nouvel article.
*   **`layout/`** : Composants de structure globale.
    *   `Header.tsx` : La barre de navigation en haut (Logo, bouton Login/Logout).
    *   `LoginModal.tsx` : La fenêtre modale pour se connecter ou s'inscrire.

### 2. `pages/` (Vues Principales)
Ce dossier contient les "pages" complètes de l'application. Chaque fichier ici correspond généralement à une Route (URL).
*   `Home.tsx` : La page d'accueil. Elle assemble `ArticleList` et `ArticleForm` (si connecté).
*   `ArticleDetails.tsx` : La page qui affiche un article en entier. Elle gère l'affichage du contenu, les likes, et la section commentaires.

### 3. `services/` (Logique Métier & Données)
C'est le "cerveau" qui gère les données. Les composants ne doivent pas savoir d'où viennent les données (API, LocalStorage, Mock), ils demandent juste au service.
*   `articleService.ts` : Simule une API pour les articles.
    *   Gère la liste des articles (`MOCK_ARTICLES`).
    *   Fonctions : `getAllArticles`, `likeArticle`, `addComment`, etc.
    *   Simule des délais réseau (loading) pour plus de réalisme.
*   `authService.ts` : Gère l'authentification.
    *   Simule le Login/Register.
    *   Stocke les utilisateurs dans le `localStorage` du navigateur pour qu'ils persistent.

### 4. `context/` (État Global)
*   `AuthContext.tsx` : Permet de partager l'état de l'utilisateur connecté (Est-il connecté ? Qui est-il ?) avec **toute** l'application sans avoir à passer les infos de composant en composant manuellement.

### 5. `types/` (Définitions TypeScript)
Définit la "forme" des données pour éviter les erreurs.
*   `article.ts` : Définit ce qu'est un `Article` (id, title, content...), un `Comment`, etc.
*   `auth.ts` : Définit ce qu'est un `User`.

### 6. Fichiers Racine
*   `App.tsx` : Le composant racine. Il définit les **Routes** (quelle URL affiche quelle Page) et la structure globale (Header + Main).
*   `main.tsx` : Le point d'entrée qui "attache" l'application React à la page HTML (`index.html`).

## Flux de Données (Exemple : "J'aime")

1.  **Action** : L'utilisateur clique sur le cœur dans `ArticleDetails`.
2.  **Composant** : `ArticleDetails` appelle `articleService.likeArticle(id, userId)`.
3.  **Service** : `articleService` met à jour les données (simule une requête serveur).
4.  **Retour** : Le service renvoie l'article mis à jour.
5.  **Mise à jour UI** : `ArticleDetails` met à jour son état local (`setArticle`), ce qui rafraîchit l'affichage instantanément (Optimistic Update).

## Technologies Clés
*   **React Router** : Pour la navigation sans rechargement de page.
*   **CSS Modules** (ou fichiers .css classiques) : Pour le style.
*   **Vite** : Pour le développement rapide et la compilation.
