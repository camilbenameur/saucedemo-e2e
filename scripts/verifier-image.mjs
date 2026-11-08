import { readFileSync } from 'node:fs';
import { chromium, firefox, webkit } from '@playwright/test';

const installed = JSON.parse(
  readFileSync(new URL('../node_modules/@playwright/test/package.json', import.meta.url)),
).version;
const expected = process.env.PLAYWRIGHT_VERSION;

if (expected && installed !== expected) {
  console.error(`Image Playwright ${expected}, paquet @playwright/test ${installed} : versions différentes.`);
  process.exit(1);
}

for (const browserType of [chromium, firefox, webkit]) {
  const browser = await browserType.launch();
  await browser.close();
  console.log(`${browserType.name()} ${browser.version()} : lancé`);
}
console.log(`Image vérifiée : @playwright/test ${installed}`);
