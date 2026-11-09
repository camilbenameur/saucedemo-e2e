# Plan de test : tests E2E automatisés sur Sauce Demo

Version du 07/11/2026. État : en cours, rien n'est exécuté à ce jour. Auteur : Camil Benameur.

## 1. Résumé

- **Objet** : 40 cas de test de bout en bout sur `https://www.saucedemo.com/`, en Playwright et TypeScript. Une colonne « Automatisé » (oui ou non) dit quels cas sont réellement écrits.
- **Exécution récurrente** : un smoke de 4 cas à chaque push ; chaque nuit, une régression des cas automatisés (cron GitHub Actions).
- **Packaging** : image officielle Playwright et `docker-compose.yml`.
- **Reporting** : rapport HTML et JUnit XML.
- **Mes choix** (priorités, seuils, fréquence du cron) sont des valeurs de départ, à réviser après les premiers runs.

## 2. Objet et références

**Objet** : définir ce qu'on teste, comment, quand et avec quels critères. **Objet de test** : le site
`https://www.saucedemo.com/`, un site tiers qui peut changer sans prévenir.

**Méthode** : rubriques inspirées de l'ISTQB Foundation Level v4.0.1 (critères d'entrée et de sortie) et des plans
de test classiques (suspension, reprise). Aucune certification ISTQB n'est revendiquée.

| Point de l'énoncé | Où le trouver |
| :--- | :--- |
| Plan de test (à réaliser) | ce document |
| Scripts E2E (à réaliser) | `tests/` |
| Orchestration et automatisation (à réaliser) | `.github/workflows/` |
| Packaging et déploiement (à réaliser) | `Dockerfile`, `docker-compose.yml`, `.github/workflows/image.yml` |
| Reporting (à expliquer) | rapports HTML et JUnit en artefact ; détail à venir dans ce plan |
| Politique de planification (à expliquer) | smoke à chaque push, régression chaque nuit ; détail à venir dans ce plan |
| Gestion de version et des données (à expliquer) | à venir dans ce plan |

**Origine des constats.** Un comportement marqué « vu » a été observé dans le navigateur. Un comportement marqué
« à confirmer » est lu dans le code public de l'éditeur (`github.com/saucelabs/sample-app-web`) et n'est confirmé
qu'à la première exécution réelle.

## 3. Périmètre

| Dans le périmètre | Hors périmètre | Raison |
| :--- | :--- | :--- |
| Connexion : nominale, 3 erreurs, utilisateur bloqué | Charge et performance réelle | Site public tiers : on ne le charge pas |
| Accès direct sans session | Sécurité offensive | Site tiers, non autorisé |
| Inventaire : 6 produits, 4 tris | Accessibilité automatisée, comparaison de captures | Hors socle, évolutions possibles |
| Fiche produit | Pages « Dynamic Catalog » et `inventory-long` | Hors énoncé |
| Panier : ajout, retrait, badge, persistance | Téléchargement du PDF de commande | Non vérifié |
| Commande en 3 étapes, calculs | Expiration de la session (10 minutes) | Test trop long |
| Menu : déconnexion, remise à zéro, liens | Accès direct à l'étape 2 ou 3 de la commande | Connu dans le code, non testé |
| Les 6 comptes publics | Tests de composants, d'intégration, d'API ; profil mobile | Pas d'accès au code du site |
