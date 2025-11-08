/**
 * Nuxt Ad Display Script
 *
 * Usage:
 * <script src="https://ads.ivan-lim.com/ads.js" data-ad-container-id="ad-container-id" async></script>
 *
 * Optional attributes:
 * - data-ad-container-id: ID of container element (if not provided, inserts after script tag)
 * - data-ad-width: Width of iframe (default: 100%)
 * - data-ad-height: Height of iframe (default: 250px)
 * - data-ad-params: Additional query parameters (e.g., "at=homepage&pk=123")
 */

// Get the current script element
const currentScript = document.currentScript || (function() {
  const scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();

// Abort early if script element not available
if (!currentScript || !currentScript.src) {
  throw new Error('Script element not found - aborting.');
}

// Get the script filename dynamically
const scriptUrl = new URL(currentScript.src);
const scriptName = scriptUrl.pathname.split('/').pop().split('?')[0];
// console.log(`[Debug Only] Module name: ${scriptName}`);  // For debug purpose only


/**
 * Lightweight console helper that prefixes log output with the currently executing script's filename.
 *
 * Provides a small wrapper around console.log and console.error that prepends a human-readable
 * prefix (e.g. "[script.js]") derived from the executing script's URL (via `currentScript.src`).
 *
 * @constant {Object} adConsole
 * @property {string} prefix Returns the formatted prefix string (e.g. "[script.js]").
 *   It computes the prefix by parsing the URL from `currentScript.src` and extracting the script filename.
 * @property {function(...*): void} log Logs one or more items to console.log with the prefix prepended.
 *   Accepts the same arguments as console.log.
 * @property {function(...*): void} error Logs one or more items to console.error with the prefix prepended.
 *   Accepts the same arguments as console.error.
 *
 * @example
 * // adConsole.log('Ad rendered', adId);
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript}
 */
const adConsole = {
  prefix: `[${scriptName}]`,
  error: function(...args) { console.error(this.prefix, ...args); },
  log: function(...args) { console.log(this.prefix, ...args); },
};

(function() {
  'use strict';

  // Get configuration from data attributes
  const config = {
    containerId: currentScript.getAttribute('data-ad-container-id'),
    params: currentScript.getAttribute('data-ad-params'),
  };
  // adConsole.log('[Debug Only] config', config);  // For debug purpose only

  // Determine the base URL (same origin as this script)
  const baseUrl = scriptUrl.origin + scriptUrl.pathname.substring(0, scriptUrl.pathname.lastIndexOf('/'));

  // Build iframe URL with query parameters
  let iframeUrl = `${baseUrl}/`;
  const queryParams = [];

  if (config.params) {
    queryParams.push(config.params);
  }

  if (queryParams.length > 0) {
    iframeUrl += '?' + queryParams.join('&');
  }

  // Create iframe element
  // Note: iframe element has a widely adopted, though somewhat subtle, default size where the width is 300 pixels and the height is 150 pixels
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  iframe.style.border = 'none';

  // Limit iframe width to its container so it scales responsively
  iframe.style.maxWidth = '100%';

  iframe.style.overflow = 'hidden';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('title', 'Advertisement');

  // Handle iframe resizing via postMessage
  window.addEventListener('message', function(event) {
    // Verify origin matches the iframe source
    if (event.origin !== new URL(iframeUrl).origin) {
      return;
    }

    const data = event.data;

    // Handle ad image resize message
    if (
      data &&
      typeof data === 'object' &&
      data.type === 'ad-dimension' &&
      data.height &&
      data.width
    ) {
      iframe.style.aspectRatio = `${data.width} / ${data.height}`;
      // iframe.style.height = `${data.height}px`; // Leave height unset — aspectRatio controls sizing and it will scale with max-width
      iframe.style.width = `${data.width}px`;
    }
  });

  // Insert iframe into the page
  if (config.containerId) {
    // Insert into specified container
    const container = document.getElementById(config.containerId);
    if (container) {
      container.appendChild(iframe);
    } else {
      adConsole.error(`Container element #${config.containerId} not found`);
    }
  } else {
    // Insert after the script tag
    currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
  }

  // Log successful initialization (can be removed in production)
  // adConsole.log(`[Debug Only] Ad iframe initialized:`, iframeUrl);  // For debug purpose only
})();
