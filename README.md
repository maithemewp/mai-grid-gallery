# SP Grid Gallery

A lightweight and flexible grid gallery block built with ACF for WordPress.

## Development

### Prerequisites
- Node.js and npm installed
- WordPress

### Installation
1. Clone this repository to your WordPress plugins directory
2. Install dependencies:
```bash
npm install
```

### Build Commands
- `npm run build` - Build assets for production
- `npm run start` - Start development mode with watch capability
- `npm run packages-update` - Update WordPress packages

### Directory Structure
```
stretchy-pants-grid-gallery/
├── build/               # Compiled assets (generated)
│   ├── css/
│   └── js/
├── block/              # Block configuration
│   └── block.json
├── src/                # Source files
│   ├── css/
│   └── js/
├── package.json
└── webpack.config.js
```