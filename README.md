# saucedemo-e2e

Tests de bout en bout automatisés de https://www.saucedemo.com/, en Playwright et TypeScript, avec une exécution
récurrente sur GitHub Actions.

[![Smoke](https://github.com/camilbenameur/saucedemo-e2e/actions/workflows/smoke.yml/badge.svg)](https://github.com/camilbenameur/saucedemo-e2e/actions/workflows/smoke.yml)
[![Régression](https://github.com/camilbenameur/saucedemo-e2e/actions/workflows/regression.yml/badge.svg)](https://github.com/camilbenameur/saucedemo-e2e/actions/workflows/regression.yml)

## État au 10/11/2026

| Élément | État |
| :--- | :--- |
| 4 tests du smoke (TC-01 à TC-04) | verts en local (Windows) et en CI |
| 4 tests de régression (TC-05 à TC-08) | verts en local (Windows, Chromium) et en CI sur les 3 navigateurs |
| Smoke à chaque push | vert, Chromium |
| Régression sur Chromium, Firefox et WebKit | verte en lancement manuel |
| Régression planifiée (cron) | verte ; tirs observés le 09/11 à 08:00 UTC et le 10/11 à 08:27 UTC, soit environ 7 h après l'heure prévue (01:17 UTC) : GitHub ne garantit pas l'heure des tâches planifiées |
| Image de test publiée sur GHCR | construite, vérifiée, utilisée par la CI |
| `docker compose run` | écrit, **pas encore exécuté** |
| Plan de test | en cours de rédaction (résumé, objet, périmètre) : [`docs/plan-de-test.md`](docs/plan-de-test.md) |

## Les tests

| Cas | Parcours | Vérifié |
| :--- | :--- | :--- |
| TC-01 | Connexion avec `standard_user` | URL de l'inventaire, titre « Products », 6 produits, cookie de session |
| TC-02 | Page interne sans session | retour à l'accueil avec le message d'accès, pour `/inventory.html` et `/cart.html` |
| TC-03 | Ajout d'un produit au panier | badge « 1 », bouton « Remove » |
| TC-04 | Commande complète | page de confirmation, panier vide |
| TC-05 | Connexion de `locked_out_user` | message « locked out », reste sur l'accueil |
| TC-06 | Mauvais mot de passe | message d'erreur, reste sur l'accueil |
| TC-07 | Tri par prix croissant | 6 prix dans l'ordre croissant, de 7.99 à 49.99 |
| TC-08 | Résumé de commande avec 2 produits | sous-total 39.98, taxe de 8 %, total = sous-total + taxe |

TC-01 à TC-04 portent les étiquettes `@smoke` et `@regression` ; TC-05 à TC-08, `@regression`. Les sélecteurs utilisent l'attribut `data-test` du site.

## Lancer les tests

### En local

Prérequis : Node.js 20 ou plus.

```bash
npm ci
npx playwright install
npm run test:smoke    # smoke, Chromium
npm test              # tout, sur les 3 navigateurs
npm run report        # ouvre le rapport HTML
```

### En conteneur

```bash
docker compose run --rm e2e
```

Le rapport HTML et le JUnit XML sont écrits dans `playwright-report/` et `test-results/`.

### Variables

| Variable | Rôle | Par défaut |
| :--- | :--- | :--- |
| `BASE_URL` | Site visé | `https://www.saucedemo.com` |
| `SAUCE_PASSWORD` | Mot de passe des comptes de démonstration | `secret_sauce`, le mot de passe public affiché sur le site |

## Exécution récurrente (GitHub Actions)

| Workflow | Déclencheur | Ce qu'il fait |
| :--- | :--- | :--- |
| `smoke.yml` | chaque push, ou à la main | les tests `@smoke` sur Chromium |
| `regression.yml` | chaque nuit à 01:17 UTC, ou à la main avec un filtre `grep` | vérifie que le site répond, puis lance `@regression` sur les 3 navigateurs, un job par navigateur |
| `image.yml` | changement du Dockerfile, des dépendances ou des tests sur `main` | construit, vérifie et publie l'image de test |

Chaque run garde son rapport HTML et son JUnit XML en artefact, même quand des tests échouent.

## Image de test

L'image `ghcr.io/camilbenameur/saucedemo-e2e` part de l'image officielle Playwright de la **même version** que
`@playwright/test`. Cette version est lue dans `package-lock.json`, qui est la seule source :

1. `image.yml` construit l'image à partir de `mcr.microsoft.com/playwright:v<version>-noble` ;
2. pendant la construction, `scripts/verifier-image.mjs` compare les versions et lance Chromium, Firefox et
   WebKit ; si l'un échoue, rien n'est publié ;
3. l'image est publiée avec deux étiquettes : `<version>` et `sha-<commit>` ;
4. `smoke.yml` et `regression.yml` lisent la même version et lancent les tests dans cette image.

Limite connue : sur un commit qui monte Playwright, les tests peuvent partir avant que la nouvelle image existe.
La montée de version se fait donc dans une pull request, fusionnée une fois l'image publiée.

## Arborescence

```
.github/workflows/   smoke, régression, image
docs/                plan de test
scripts/             vérification de l'image
tests/               tests Playwright
Dockerfile           image de test
docker-compose.yml   lancement en conteneur
playwright.config.ts navigateurs, rapports, relances
```

## Reste à faire

- Automatiser les autres cas du plan de test.
- Exécuter `docker compose run` sur un poste avec Docker.
- Fournir un exemple de `.gitlab-ci.yml`, non exécuté.
