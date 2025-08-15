# Easy Radio (易收音機)

A simple, accessible radio webapp for Hong Kong radio channels, starting with RTHK Radio 1. Features a high-contrast design with large, elderly-friendly controls and Chinese language support.

## Features

- **Chinese-first interface** with English toggle
- **High-contrast design** with blue accent theme
- **Accessibility-focused** with large touch targets (≥44px) and keyboard navigation
- **PWA support** for mobile installation
- **HLS and HTTP stream support** with automatic detection
- **Firebase hosting and functions** for scalable deployment
- **Memory caching** for stream URLs (30-60 minutes)

## Architecture

- **Frontend**: React + TypeScript + Vite with i18next for localization
- **Backend**: Firebase Functions with Express + TypeScript
- **Stream Resolution**: Axios + Cheerio for web scraping with fallback URLs
- **Audio Playback**: HLS.js for HLS streams, native Audio API for HTTP streams

## Local Development

### Prerequisites

- Node.js 18+ 
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   
   This will:
   - Start Vite dev server on `http://localhost:5173`
   - Start Firebase emulators (Functions on port 5001, Hosting on port 5000)
   - Proxy `/api/*` requests from frontend to functions emulator

3. **Access the app**:
   - Frontend: `http://localhost:5173` (with API proxy)
   - Emulator UI: `http://localhost:4000`

### Firebase Emulator Details

The development setup uses Firebase emulators to simulate the production environment:

- **Functions Emulator**: Port 5001 - hosts the Express API
- **Hosting Emulator**: Port 5000 - serves static files and routes API calls
- **Emulator UI**: Port 4000 - Firebase emulator dashboard

## API Endpoints

### GET /api/channels
Returns available radio channels.

**Response**:
```json
{
  "success": true,
  "channels": [
    {
      "id": "radio1",
      "name": {
        "en": "RTHK Radio 1", 
        "zh": "RTHK 第一台"
      }
    }
  ]
}
```

### GET /api/stream-url/:channelId
Resolves and returns stream URL for a channel.

**Response**:
```json
{
  "success": true,
  "type": "hls",
  "url": "https://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8"
}
```

### GET /api/proxy?url=...
Optional CORS proxy for any URL (if needed).

### GET /api/health
Health check endpoint.

## Stream Resolution

The backend scrapes `https://www.rthk.hk/radio/radio1` to find the current stream URL using multiple patterns:

1. **HLS URLs** in script tags (`.m3u8` files)
2. **Audio source elements** with stream URLs
3. **Data attributes** containing stream information

If scraping fails, it uses a fallback stream URL. Stream URLs are cached in memory for 30-60 minutes.

## Deployment

### Prerequisites

1. **Create Firebase project**:
   ```bash
   firebase login
   firebase projects:create easy-radio-mvp
   firebase use easy-radio-mvp
   ```

2. **Enable required services**:
   - Firebase Hosting
   - Firebase Functions

### Deploy

```bash
npm run deploy
```

This will:
1. Build the frontend (`web/dist`)
2. Build the functions (`functions/lib`) 
3. Deploy both to Firebase

### Production URLs

- **Web App**: `https://easy-radio-mvp.web.app`
- **API**: `https://us-central1-easy-radio-mvp.cloudfunctions.net/app/api/*`

## Project Structure

```
├── web/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks (audio player)
│   │   ├── services/       # API services
│   │   ├── i18n.ts        # Internationalization setup
│   │   └── index.css      # High-contrast theme
│   ├── public/
│   │   ├── manifest.json  # PWA manifest
│   │   └── sw.js         # Service worker
│   └── vite.config.ts    # Vite configuration
├── functions/             # Backend (Firebase Functions)
│   ├── src/
│   │   ├── channels.ts    # Channel configuration
│   │   ├── streamResolver.ts # Stream URL resolution
│   │   └── index.ts       # Express app
│   ├── package.json       # Functions dependencies
│   └── tsconfig.json     # Functions TypeScript config
├── firebase.json         # Firebase configuration
├── .firebaserc          # Firebase project settings
└── package.json         # Root scripts
```

## Configuration

### Adding New Channels

Edit `functions/src/channels.ts`:

```typescript
export const channels: Channel[] = [
  {
    id: 'radio1',
    name: { en: 'RTHK Radio 1', zh: 'RTHK 第一台' },
    sourcePage: 'https://www.rthk.hk/radio/radio1',
    fallbackStreamUrl: 'https://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8'
  }
  // Add more channels here
];
```

### Updating Fallback Stream URLs

If scraping fails frequently, update the `fallbackStreamUrl` in the channel configuration. These URLs can be found by:

1. Inspecting the radio station's website
2. Checking network requests in browser dev tools
3. Looking for direct HLS (.m3u8) or audio stream URLs

## Accessibility

The app is designed with accessibility in mind:

- **High contrast colors** (WCAG AA compliant)
- **Large touch targets** (minimum 44px, preferred 56px)
- **Focus indicators** with 3px blue outline
- **Screen reader support** with proper ARIA labels
- **Keyboard navigation** support
- **Large typography** for elderly users

## Browser Support

- **Modern browsers** with ES2017+ support
- **HLS.js** for HLS streams in browsers without native HLS support
- **PWA support** for installation on mobile devices
- **Responsive design** for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test locally with `npm run dev`
5. Build to ensure no errors: `npm run build`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
