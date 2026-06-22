# Tutorial-Regeln Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine verbindliche, prozessunabhängige Vorlage für Tutorial-Bereiche in der Übergabe-App dokumentieren.

**Architecture:** Die Regeln stehen zentral in `docs/tutorial/tutorial-rules.md`. Sie leiten sich aus dem Servicegrad-Tutorial ab, ohne dessen fachliche Inhalte oder produktiven Konfigurationswerte zu übernehmen. Die Datei definiert Aufbau, Pflichtinformationen, sichere Konfiguration, Tests und Übergabe.

**Tech Stack:** Markdown.

---

### Task 1: Tutorial-Standard dokumentieren

**Files:**
- Modify: `docs/tutorial/tutorial-rules.md`
- Verify: `docs/Servicegrad/Servicegrad.md`
- Verify: `src/main/db/processes/servicegrad.ts`

- [ ] **Step 1: Die Servicegrad-Referenz auf Pflichtbestandteile prüfen**

Lies die vorhandene Prozessdokumentation und das ausgelieferte Tutorial. Übernimm als allgemeine Anforderungen die nachvollziehbare Ablaufbeschreibung, Voraussetzungen, lokale Datei- und Pfadkonfiguration, eingebetteten ausführbaren Code, sichere Tests, Fehlerbehandlung und Übergabe. Übernimm keine Servicegrad-spezifischen SAP-Daten, Konten, Empfänger oder Netzpfade.

- [ ] **Step 2: Die Regeln in die zentrale Markdown-Datei schreiben**

Ersetze die leere Datei durch eine deutsche Vorlage mit den Abschnitten Ziel und Geltungsbereich, Pflichtaufbau, verbindliches Schrittformat, Dateien und Konfiguration, Code und Skripte, Test und Fehlerbehandlung, Sicherheit sowie Qualitätscheckliste. Formuliere jeden Punkt als überprüfbare Regel für Autorinnen und Autoren künftiger Prozess-Tutorials.

- [ ] **Step 3: Die Dokumentation gegen die Referenz prüfen**

Run: `Get-Content -Raw docs/tutorial/tutorial-rules.md`

Expected: Die Regeln verlangen mindestens alle im Servicegrad-Tutorial verwendeten Arten von Informationen und weisen ausdrücklich auf lokale Anpassungen, Testwerte sowie den Schutz produktiver Zugangsdaten und Empfänger hin.

- [ ] **Step 4: Commit**

```bash
git add docs/tutorial/tutorial-rules.md docs/superpowers/plans/2026-06-21-tutorial-rules.md
git commit -m "docs: define process tutorial rules"
```
