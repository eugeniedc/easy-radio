# Easy Radio HK

A simple, accessible web application for playing RTHK radio channels, specifically designed for elderly users with high-contrast UI and large controls.

## Features

- 🎵 **Live RTHK Radio Streaming** - Play 5 RTHK radio channels with HLS audio support
- ♿ **Accessibility First** - WCAG AA compliance with keyboard navigation and screen reader support  
- 🔍 **High Contrast Theme** - Easy-to-read design optimized for elderly users
- 📱 **PWA Support** - Installable as a Progressive Web App on mobile and desktop
- 🎛️ **Large Controls** - Big buttons and clear navigation for easy interaction
- 🔊 **Volume Control** - Simple volume slider with large touch targets

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **hls.js** for HLS audio streaming support
- **CSS Custom Properties** for high-contrast theming
- **PWA** features with service worker

### Backend  
- **Node.js** with Express and TypeScript
- **RTHK API Integration** for live stream URLs
- **CORS Proxy** to handle cross-origin streaming issues
- **Cheerio** for web scraping when needed

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eugeniedc/easy-radio.git
   cd easy-radio
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Frontend dev server on http://localhost:5173
   - Backend API server on http://localhost:3001

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## Available Radio Channels

- **RTHK Radio 1** - News, current affairs and documentaries
- **RTHK Radio 2** - Popular music and entertainment  
- **RTHK Radio 3** - English programming
- **RTHK Radio 4** - Classical music
- **RTHK Radio 5** - Literature and culture

## Accessibility Features

### Visual
- High contrast color scheme (yellow on black by default)
- Large font sizes (18px base, up to 32px for headings)
- Clear visual focus indicators  
- Support for system light/dark theme preferences
- Large touch targets (minimum 44px on mobile)

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order through interface
- Clear focus indicators with 4px outline
- Skip-to-main-content link for screen readers

### Screen Reader Support
- Semantic HTML with proper landmarks
- ARIA labels and descriptions for complex controls
- Live regions for dynamic content updates
- Descriptive button text and alt attributes

### Motor Accessibility  
- Large button sizes for easy clicking/tapping
- Generous spacing between interactive elements
- Simple interface without complex gestures
- Support for reduced motion preferences

## Browser Support

- **Modern browsers** with HLS support (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** on iOS and Android
- **PWA installation** on supported platforms
- **Fallback** for browsers with native HLS support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.