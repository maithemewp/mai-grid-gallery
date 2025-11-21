# Mai Grid Gallery

A responsive, stylish, and lightweight grid gallery block for WordPress with lightbox support.

## Features

- **Native WordPress Block**: Built using the WordPress Block Editor API
- **Image & Video Support**: Supports both images and videos in the gallery
- **InnerBlocks Integration**: Uses WordPress InnerBlocks for drag-and-drop reordering
- **Max Visible Items**: Limit how many items are visible initially (with lazy loading support)
- **Focal Point Picker**: Adjust focal points for images within the gallery
- **Lightbox Support**: Integrated with GLightbox for image/video viewing
- **Editor Controls**: Toggle visibility of extra images in the editor
- **Responsive Design**: Automatically adapts to different screen sizes
- **Wide & Full Alignment**: Supports wide and full width alignments

## Requirements

- WordPress 6.7 or higher
- PHP 8.2 or higher
- Node.js and npm (for development)

## Installation

1. Clone this repository to your WordPress plugins directory:
```bash
cd wp-content/plugins
git clone [repository-url] mai-grid-gallery
```

2. Install dependencies:
```bash
cd mai-grid-gallery
npm install
composer install
```

3. Build the assets:
```bash
npm run build
```

4. Activate the plugin through the WordPress admin panel.

## Development

### Build Commands

- `npm run build` - Build assets for production
- `npm run start` - Start development mode with watch capability
- `npm run packages-update` - Update WordPress packages
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code using Prettier

### Directory Structure

```
mai-grid-gallery/
├── block/              # Block configuration
│   └── block.json      # Block metadata and attributes
├── build/              # Compiled assets (generated)
│   ├── editor.js       # Editor JavaScript
│   ├── editor-styles.css
│   ├── frontend.js     # Frontend JavaScript
│   └── styles.css      # Frontend styles
├── src/                # Source files
│   ├── editor.js       # Block editor implementation
│   ├── editor-styles.css
│   ├── frontend.js     # Frontend functionality (lightbox)
│   ├── main.css        # Main styles
│   └── styles.css      # Additional styles
├── mai-grid-gallery.php  # Main plugin file
├── package.json        # npm dependencies
└── composer.json       # PHP dependencies
```

## Usage

### Adding a Gallery

1. In the WordPress editor, click the "+" button to add a new block
2. Search for "Mai Grid Gallery" or find it in the Media category
3. Click the block to add it to your page

### Adding Media

- **Empty State**: Click "Upload" or "Media Library" to add images/videos
- **Existing Gallery**: Use the "Manage Media" toolbar button to add more items
- **Drag & Drop**: Drag and drop images directly into the gallery
- **Multiple Selection**: Select multiple items at once from the Media Library

### Settings

- **Max Visible Items**: Set how many items are initially visible (0 = show all, up to 8)
  - Items beyond this limit are lazy-loaded on the frontend
  - Use the "Show hidden" / "Hide extra" toolbar button in the editor to toggle visibility

### Focal Point

- Click on an image within the gallery
- In the block sidebar, use the Focal Point Picker to adjust the focus point
- The focal point affects how the image is cropped/positioned

## Technical Details

### Block Structure

- **Block Name**: `mai/grid-gallery`
- **Inner Blocks**: Uses `core/image` and `core/video` blocks
- **Context**: Provides `mai/grid-gallery/maxVisible` context to inner blocks
- **Attributes**:
  - `maxVisible` (number): Maximum number of visible items
  - `focalPoints` (object): Focal point data for images

### Frontend Rendering

- Images beyond `maxVisible` are rendered as `<span>` elements with data attributes
- JavaScript handles lazy loading and lightbox initialization
- Uses GLightbox library for lightbox functionality

## License

GPL-2.0-or-later

## Author

BizBudding
