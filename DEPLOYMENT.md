# King Cup Web - Deployment Guide

## Schnell-Deployment via Manus UI

Die Web-Version kann direkt über die Manus Management UI deployed werden:

### Schritt 1: Öffne Manus Management UI
1. Klick auf das **Management UI Icon** (rechts oben im Chat)
2. Wähle **"Code"** Tab

### Schritt 2: Lade Projekt herunter
1. Klick auf **"Download all files"**
2. Das Projekt wird als ZIP heruntergeladen

### Schritt 3: Erstelle neues Projekt
1. Gehe zu https://manus.im
2. Klick auf **"New Project"**
3. Wähle **"Web App"** oder **"React"**
4. Lade die heruntergeladene ZIP-Datei hoch

### Schritt 4: Konfiguriere Projekt
- **Name:** King Cup Web
- **Beschreibung:** Web-Version für Beer Pong Turnier Spieler
- **Build Command:** `pnpm build`
- **Start Command:** `pnpm dev`
- **Output Directory:** `dist`

### Schritt 5: Deploy
1. Klick auf **"Deploy"**
2. Manus erstellt automatisch eine Production-Domain
3. Die Web-Version ist dann unter einer permanenten URL erreichbar

## Manuelle Deployment-Optionen

### Option 1: Vercel (Empfohlen)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
1. Push zu GitHub
2. Aktiviere GitHub Pages in Repository Settings
3. Wähle `dist` als Source Directory

## Umgebungsvariablen

Die Web-Version nutzt diese Umgebungsvariablen:

```env
VITE_API_BASE_URL=https://beerpongapp-rtshsyxf.manus.space/api
```

Diese sind bereits in `vite.config.ts` konfiguriert.

## Production Build

```bash
# Build erstellen
pnpm build

# Lokal testen
cd dist
python3 -m http.server 8000
# Öffne http://localhost:8000
```

## Troubleshooting

### API-Calls funktionieren nicht
- Überprüfe, dass `VITE_API_BASE_URL` richtig gesetzt ist
- Stelle sicher, dass der Backend-Server läuft
- Überprüfe Browser-Konsole auf CORS-Fehler

### Build-Fehler
```bash
# Dependencies neu installieren
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Erneut bauen
pnpm build
```

## Support

Bei Fragen oder Problemen: Kontaktiere den Entwickler oder öffne ein Issue im Repository.
