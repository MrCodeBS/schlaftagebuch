# Schlaftagebuch (Sleep Diary)

Ein einfaches, nutzerfreundliches Schlaftagebuch für das Abend- und Morgenprotokoll (Schlafrestriktionstherapie). Es ist als PWA (Progressive Web App) konzipiert, speichert alle Daten lokal auf dem Gerät und ist offline nutzbar.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Vercel Deployment (Kostenlos)

Du kannst diese App extrem einfach und kostenlos bei Vercel hosten.

### Methode 1: Drag & Drop (Am einfachsten)
1. Führe lokal den Befehl `npm run build` aus. Das erstellt einen `dist` Ordner.
2. Gehe auf [Vercel](https://vercel.com) und erstelle dir einen kostenlosen Account.
3. Klicke auf "Add New..." -> "Project".
4. Ziehe den neu erstellten `dist` Ordner einfach per Drag & Drop in das Feld "Deploy without Git".
5. Vercel stellt die Seite in Sekunden online!

### Methode 2: Über GitHub (Automatische Updates)
1. Lade diesen Code in ein GitHub Repository hoch.
2. Gehe zu [Vercel](https://vercel.com) und verbinde deinen GitHub Account.
3. Wähle das Repository aus und klicke auf "Import".
4. Framework Preset (Vite) wird automatisch erkannt. Klicke auf "Deploy".
5. Jede Änderung am Code auf GitHub wird nun automatisch live geschaltet.

### Wichtiger Hinweis zu Daten & URLs!
**Alle Daten bleiben im Browser!** Es gibt keine Datenbank auf einem Server.
Wenn du die Seite über verschiedene URLs aufrufst (z.B. Preview-URLs von Vercel und die echte Live-URL), sind die Daten **nicht** miteinander verknüpft, da der Browser sie pro URL (Domain) speichert. 
Nutze also immer die finale Produktions-URL (am besten als PWA auf den Homescreen deines Handys installiert).

## CSV Spalten-Definition

Beim Exportieren als CSV werden folgende Spalten generiert (Trennzeichen: `;`):
- Datum
- Abend_Tagschlaf (Ja/Nein)
- Abend_Tagschlaf_Dauer (in Minuten)
- Abend_Alkohol (Ja/Nein)
- Abend_Stimmung (1-6)
- Bettzeit (HH:MM)
- Licht_Aus (HH:MM)
- Einschlafdauer_Min
- Nachts_Wach (Ja/Nein)
- Nachts_Wach_Dauer (in Minuten)
- Aufwachzeit (HH:MM)
- Aufstehzeit (HH:MM)
- Morgen_Stimmung (1-6)
- Morgen_Schlafqualitaet (1-6)
- Berechnet_Bettzeit_Min
- Berechnet_Schlafzeit_Min
- Berechnet_Schlafeffizienz (%)

## UX Entscheidungen

- **Große Buttons & Touch Targets**: Überall mind. 48px hoch für gestresste, müde Nutzer im Bett.
- **Lokale Speicherung (Zustand + IndexedDB)**: Kein Login, maximale Privatsphäre, blitzschnell und offline-fähig.
- **Schritt-für-Schritt Flow**: Keine überfordernden riesigen Formulare, nur eine Frage pro Ansicht (Wizard-Style).
- **"Werte von gestern übernehmen"**: Macht das Ausfüllen für normale Nächte zu einer Sache von Sekunden.
- **Dunkelmodus Support**: Sehr wichtig für eine App, die vorwiegend nachts oder früh morgens genutzt wird.
- **Warnung bzgl. Persistenz**: Explizite Hinweise und Button für CSV Export, da die Daten nur im Browser liegen und bei Cache-Leerungen gelöscht werden könnten.
- **Verzicht auf Text-Eingaben**: Nahezu alle Eingaben erfolgen über spezielle Picker (NumberStepper, TimePicker) oder Buttons, was das Tippen auf kleinen Tastaturen erspart.
