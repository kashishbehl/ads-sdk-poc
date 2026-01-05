function extractKeyFromScript(
  scriptName,
  param = "key"
) {
  const selectedScript = extractScriptFromDocument(scriptName);
  if (selectedScript) {
    if (selectedScript.getAttribute(`data-${param}`)) {
      return selectedScript.getAttribute(`data-${param}`);
    } else if (selectedScript.src.indexOf(`${param}=`) > -1) {
      // extract from query param
      const queryParams = selectedScript.src.split("?")[1];
      const params = parseQueryParam(queryParams);
      return params[param];
    }
  }
  return "";
}

function parseQueryParam(queryParams) {
  return decodeURI(queryParams)
    .replace("?", "")
    .split("&")
    .map((param) => param.split("="))
    .reduce((values, [key, value]) => {
      values[key] = value;
      return values;
    }, {});
}

function extractBasePathFromSrc(scriptName) {
  const selectedScript = extractScriptFromDocument(scriptName);
  if (selectedScript && selectedScript.src) {
    const baseBuildPath = selectedScript.src.substr(
      0,
      selectedScript.src.lastIndexOf("/")
    );
    return baseBuildPath;
  }
  return "https://cdn.razorpay.com/ads";
}


function extractScriptFromDocument(
  scriptName
) {
  const script = Array.prototype.slice
    .apply(document.scripts)
    .filter(function (script) {
      return script.src.indexOf(scriptName) > -1;
    });
  return script && script[0] ? script[0] : null;
}

class Widget {
  constructor(targetSelector, options = {}) {
    this.targetSelector = targetSelector;
    this.options = {
      width: '100%',
      height: '500px',
      ...options
    };
    
    // Setup message handling for iframe communication
    this.boundHandleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.boundHandleMessage);
  }

  render() {
    // Find target element
    this.target = document.querySelector(this.targetSelector.container);
    if (!this.target) {
      throw new Error(`Target element ${this.targetSelector} not found`);
    }

    // Create iframe element if it doesn't exist
    if (!this.iframe) {
      this.iframe = document.createElement('iframe');
      
      // Set iframe attributes
      this.iframe.style.width = '100%';
      this.iframe.style.border = 'none';
      this.iframe.style.overflow = 'hidden';
      // Start with a minimum height, will be adjusted dynamically
      this.iframe.style.height = '100px';

      let scriptName = "/widget.js";
      if (window.location.host.includes("localhost")) {
        scriptName = "widget.js";
      }

      const key = extractKeyFromScript(scriptName);
      const basePath = extractBasePathFromSrc(scriptName);

      console.log({ key, basePath });

      const frameSrc =`${basePath}/widget.html`;
      
      // Set the source to our bundled widget HTML with query parameters
      const widgetUrl = new URL(frameSrc, window.location.href);
      
      // Add options as query parameters
      Object.keys(this.options).forEach(key => {
        const value = this.options[key];
        if (value !== null && value !== undefined) {
          widgetUrl.searchParams.set(key, String(value));
        }
      });
      
      this.iframe.src = widgetUrl.href;
    }
    
    // Append iframe to target element
    this.target.appendChild(this.iframe);

    return this;
  }

  destroy() {
    // Remove iframe if it exists
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    
    // Remove event listener
    window.removeEventListener('message', this.boundHandleMessage);
    
    // Clean up references
    this.iframe = null;
    this.target = null;
  }

  handleMessage(event) {
    // Handle messages from iframe for dynamic height adjustment
    if (event.data && event.data.type === 'resize') {
      if (this.iframe && event.data.height) {
        this.iframe.style.height = `${event.data.height}px`;
        console.log('Iframe height adjusted to:', event.data.height + 'px');
      }
    }
    
    // Handle other messages if needed
    console.log('Message from iframe:', event.data);
  }
}

export default Widget; 