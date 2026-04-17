# King Cup - Web Version

Eine React-basierte Web-Anwendung für Spieler zur Teilnahme an Beer-Pong-Turnieren.

## Features

- 🎯 **Turnier beitreten**: Mit Share-Code oder QR-Code
- 👥 **Team-Auswahl**: Wähle dein Team aus
- 📊 **Statistiken**: Sehe deine Spielstatistiken in Echtzeit
- 🎮 **Match-Verlauf**: Übersicht über alle gespielten Spiele
- 🔄 **Live-Updates**: Automatische Synchronisation alle 5 Sekunden
- 🔔 **Benachrichtigungen**: Erhalte Benachrichtigungen über wichtige Events

## Tech Stack

- **Framework**: React 19
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API Client**: Axios
- **Language**: TypeScript

## Installation

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev

# Production Build erstellen
pnpm build

# Preview des Production Builds
pnpm preview
```

## Struktur

```
src/
├── screens/          # Seiten der App
│   ├── JoinTournament.tsx
│   ├── SelectTeam.tsx
│   ├── Home.tsx
│   ├── Stats.tsx
│   └── Matches.tsx
├── components/       # Wiederverwendbare Komponenten
│   ├── QRScanner.tsx
│   └── NotificationToast.tsx
├── services/         # API und Business Logic
│   ├── api.ts
│   ├── notifications.ts
│   └── storage.ts
├── hooks/            # Custom React Hooks
│   └── usePolling.ts
├── App.tsx           # Hauptkomponente mit Router
└── main.tsx          # Entry Point
```

## API Integration

Die Web-Version nutzt die gleichen API-Endpoints wie die mobile App:

- `POST /api/tournaments/join` - Turnier beitreten
- `GET /api/tournaments/:id` - Turnier-Daten abrufen
- `POST /api/tournaments/:id/select-team` - Team auswählen
- `GET /api/tournaments/:id/player-stats/:playerId` - Spieler-Statistiken
- `GET /api/tournaments/:id/player-matches/:playerId` - Match-Verlauf
- `POST /api/tournaments/:id/register-push-token` - Push-Token registrieren

## Deployment

Die App wird auf einer temporären Manus-URL deployed:
```
https://beerpongapp-rtshsyxf.manus.space/web
```

## Browser-Kompatibilität

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

## Entwicklung

### Neue Seite hinzufügen

1. Neue Komponente in `src/screens/` erstellen
2. Route in `src/App.tsx` hinzufügen
3. Navigation in anderen Screens aktualisieren

### API-Calls hinzufügen

1. Neue Methode in `src/services/api.ts` hinzufügen
2. In der entsprechenden Screen-Komponente nutzen
3. Error-Handling mit `notificationService.notify()` hinzufügen

### Styling

Tailwind CSS wird verwendet. Farben sind in `tailwind.config.js` definiert:
- `primary`: #FCD34D (Gelb)
- `secondary`: #1F2937 (Dunkelgrau)
- `background`: #0F172A (Dunkelblau)
- `surface`: #1E293B (Dunkelblau-Grau)
- `foreground`: #F1F5F9 (Hellgrau)
- `muted`: #94A3B8 (Mittleres Grau)

## Lizenz

Privat
