# Widget Usage Examples

## Simple Usage (Works Everywhere!)
The widget automatically detects where it was loaded from and uses the same origin for the iframe:

```javascript
const widget = new Widget('#widget-container', {
    height: '400px',
    width: '100%'
});
```

## How It Works

The widget intelligently determines the iframe source based on where the widget script itself was loaded from:

### Development Scenario
```html
<!-- Script loaded from localhost:3000 -->
<script src="http://localhost:3000/widget.js"></script>
<script>
    // Widget automatically loads iframe from http://localhost:3000/widget.html
    const widget = new Widget('#widget-container', { height: '400px' });
</script>
```

### CDN Scenario
```html
<!-- Script loaded from CDN -->
<script src="https://cdn.example.com/widget.js"></script>
<script>
    // Widget automatically loads iframe from https://cdn.example.com/widget.html
    const widget = new Widget('#widget-container', { height: '400px' });
</script>
```

### Cross-Domain Test Scenario
```html
<!-- Test app on localhost:8000 loading widget from localhost:3000 -->
<script src="http://localhost:3000/widget.js"></script>
<script>
    // Widget automatically loads iframe from http://localhost:3000/widget.html
    // Even though the page is on localhost:8000!
    const widget = new Widget('#widget-container', { height: '400px' });
</script>
```

## Benefits

- ✅ **Zero Configuration**: No need to specify URLs or environments
- ✅ **Works Anywhere**: Same code works in dev, staging, and production
- ✅ **Cross-Domain**: Handles cross-domain scenarios automatically
- ✅ **CDN Ready**: Perfect for CDN deployments
- ✅ **Backward Compatible**: Fallback to relative path if detection fails

## Advanced Usage

You can still pass all the same options:

```javascript
const widget = new Widget('#widget-container', {
    height: '600px',
    width: '800px',
    // Any custom options you want to pass to the iframe
    theme: 'dark',
    apiKey: 'your-api-key'
});
```

All options (except internal ones) are automatically passed as query parameters to the iframe. 