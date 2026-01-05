# Widget Package

This package provides both an injectable widget script and reusable UI components.

## Installation

```bash
npm install your-widget-package
```

## Usage

### As an Injectable Script

1. Include the script in your HTML:
```html
<script src="dist/injectable/widget.js"></script>
```

2. Initialize and render the widget:
```javascript
// Initialize the widget
const widget = new Widget('#target-element', {
  width: '100%',
  height: '500px'
});

// Render when ready
widget.render();

// Clean up when done
widget.destroy();
```

### As an NPM Package

Import and use components directly in your Svelte application:

```javascript
import { YourComponent } from 'your-widget-package';
```

Then use in your Svelte template:

```svelte
<YourComponent 
  title="Custom Title"
  content="Custom Content"
/>
```

## Building

- Build both versions: `npm run build`
- Build injectable version only: `npm run build:injectable`
- Build npm package only: `npm run build:package`
- Development server: `npm run dev`

## Local Testing

### Testing as NPM Package

1. In this package directory, run:
```bash
npm run build
npm link
```

2. In your test application directory, run:
```bash
npm link your-widget-package
```

3. Import and use in your application:
```javascript
// For NPM package components
import { YourComponent } from 'your-widget-package';

// For injectable script
import Widget from 'your-widget-package/dist/injectable/widget';
```

### Testing Injectable Script

1. After building, copy the contents of `dist/injectable` to your test application's public directory:
```bash
cp -r dist/injectable/* /path/to/your/app/public/
```

2. Include in your HTML:
```html
<script src="/widget.js"></script>
```

### Cleanup

When done testing, unlink the package:
```bash
# In your test application directory
npm unlink your-widget-package

# In this package directory
npm unlink
```

## Options

The injectable widget accepts the following options:

- `width`: Width of the widget (default: '100%')
- `height`: Height of the widget (default: '500px')

## License

ISC 