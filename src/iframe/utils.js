/**
 * @typedef {'react-native' | 'ios-native' | 'android-native' | 'flutter' | 'iframe' | 'standalone'} Environment
 */

/**
 * @typedef {Object} WidgetMessage
 * @property {string} type
 * @property {*} [key] - Additional properties
 */

// Detect which environment we're running in
function getEnvironment() {
  if (window.ReactNativeWebView) {
    return 'react-native';
  }
  if (window.webkit?.messageHandlers?.nativeBridge) {
    return 'ios-native';
  }
  if (window.Android) {
    return 'android-native';
  }
  if (window.flutter_inappwebview) {
    return 'flutter';
  }
  if (window.parent && window.parent !== window) {
    return 'iframe';
  }
  return 'standalone';
}

const environment = getEnvironment();

/**
 * Unified function to send messages to parent/native
 * @param {WidgetMessage | string} message
 */
export function sendMessageToHost(message) {
  const payload = typeof message === 'string' ? message : JSON.stringify(message);
  
  switch (environment) {
    case 'react-native':
      window.ReactNativeWebView?.postMessage(payload);
      break;
      
    case 'ios-native':
      window.webkit?.messageHandlers?.nativeBridge?.postMessage(message);
      break;
      
    case 'android-native':
      window.Android?.postMessage(payload);
      break;
      
    case 'flutter':
      window.flutter_inappwebview?.callHandler('messageHandler', message);
      break;
      
    case 'iframe':
      window.parent.postMessage(message, '*');
      break;
      
    default:
      console.log('No host to send message to:', message);
  }
}

// Export environment for external use
export { environment, getEnvironment };

