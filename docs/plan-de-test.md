# Plan de test : tests E2E automatisés sur Sauce Demo

Version du 07/11/2026. État : en cours, rien n'est exécuté à ce jour. Auteur : Camil Benameur.

## 1. Résumé

- **Objet** : 40 cas de test de bout en bout sur `https://www.saucedemo.com/`, en Playwright et TypeScript. Une colonne « Automatisé » (oui ou non) dit quels cas sont réellement écrits.
- **Exécution récurrente** : un smoke de 4 cas à chaque push ; chaque nuit, une régression des cas automatisés (cron GitHub Actions).
- **Packaging** : image officielle Playwright et `docker-compose.yml`.
- **Reporting** : rapport HTML et JUnit XML.
- **Mes choix** (priorités, seuils, fréquence du cron) sont des valeurs de départ, à réviser après les premiers runs.
