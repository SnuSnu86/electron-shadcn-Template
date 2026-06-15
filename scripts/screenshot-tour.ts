/**
 * Screenshot-Tour für die visuelle Verifikation.
 * Startet Electron gegen den laufenden Vite-Dev-Server (npm start muss laufen)
 * und fotografiert alle Hauptansichten inkl. eines echten Prozesslaufs.
 *
 * Aufruf: npx tsx scripts/screenshot-tour.ts
 */
import fs from "node:fs";
import path from "node:path";
import { _electron as electron, type Page } from "@playwright/test";

const OUT = path.resolve(import.meta.dirname, "..", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const shot = async (page: Page, name: string) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`📸 ${name}.png`);
};

async function run() {
  const app = await electron.launch({
    args: [
      path.resolve(import.meta.dirname, "..", ".vite", "build", "main.js"),
    ],
  });
  const page = await app.firstWindow();
  page.on("console", (msg) =>
    console.log(`[renderer:${msg.type()}]`, msg.text())
  );
  page.on("pageerror", (err) => console.error("[pageerror]", err));
  await page.setViewportSize({ width: 1480, height: 920 });

  // Leitstand
  try {
    await page.waitForSelector("h1:has-text('Leitstand')", { timeout: 20_000 });
  } catch (err) {
    await shot(page, "00-fehlerzustand");
    throw err;
  }
  await page.waitForTimeout(1800);
  await shot(page, "01-leitstand");

  // Katalog
  await page.click("text=Prozesskatalog");
  await page.waitForSelector("h1:has-text('Prozesskatalog')");
  await page.waitForTimeout(1200);
  await shot(page, "02-katalog");

  // Detail: Servicegrad
  await page.click("text=Servicegrad-Ermittlung");
  await page.waitForSelector("h1:has-text('Servicegrad-Ermittlung')");
  await page.waitForTimeout(1200);
  await shot(page, "03-detail-uebersicht");

  // Runbook-Tab
  await page.click("button[role='tab']:has-text('Runbook')");
  await page.waitForTimeout(700);
  await shot(page, "04-detail-runbook");

  // Konfiguration
  await page.click("button[role='tab']:has-text('Konfiguration')");
  await page.waitForTimeout(700);
  await shot(page, "05-detail-konfiguration");

  // Run starten
  await page.click("button:has-text('Prozess starten')");
  await page.waitForSelector("text=Zusammenfassung");
  await page.waitForTimeout(500);
  await shot(page, "06-start-dialog");
  await page.click("button:has-text('Jetzt starten')");
  await page.waitForTimeout(2500);
  await shot(page, "07-live-log");
  await page.waitForTimeout(5500);
  await shot(page, "08-run-fertig");

  // Tutorial-Wizard
  await page.click("button[role='tab']:has-text('Tutorial')");
  await page.waitForTimeout(600);
  await page.click("button:has-text('Tutorial starten')");
  await page.waitForTimeout(900);
  await shot(page, "09-tutorial-wizard");
  await page.click("button:has-text('Abbrechen')");

  // Einstellungen
  await page.click("text=Einstellungen");
  await page.waitForSelector("h1:has-text('Einstellungen')");
  await page.waitForTimeout(900);
  await shot(page, "10-einstellungen");

  await app.close();
  console.log("✅ Tour abgeschlossen");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
