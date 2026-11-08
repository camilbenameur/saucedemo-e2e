ARG PLAYWRIGHT_VERSION=1.65.0
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG PLAYWRIGHT_VERSION
ENV PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION} HOME=/root
LABEL org.opencontainers.image.source=https://github.com/camilbenameur/saucedemo-e2e

WORKDIR /e2e
COPY package.json package-lock.json ./
RUN npm ci

COPY scripts/verifier-image.mjs scripts/
RUN node scripts/verifier-image.mjs

COPY playwright.config.ts ./
COPY tests ./tests

CMD ["npx", "playwright", "test"]
