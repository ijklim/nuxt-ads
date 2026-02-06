/**
 * Safe postMessage handler for iframe communication
 * Prevents message injection and validates origin
 */

export interface SafeMessage {
  type: string;
  [key: string]: any;
}

/**
 * Validates postMessage events with origin checking
 * Only allows messages from the same origin (not *)
 * @param event MessageEvent to validate
 * @param allowedOrigins Array of allowed origins (defaults to current origin)
 * @returns SafeMessage if valid, null if invalid
 */
export function validateMessageEvent(
  event: MessageEvent,
  allowedOrigins?: string[]
): SafeMessage | null {
  // Default to current origin only
  const origins = allowedOrigins || [window.location.origin];

  // Strict origin validation - no wildcards
  if (!origins.includes(event.origin)) {
    console.warn(
      `[Security] Rejected message from untrusted origin: ${event.origin}`
    );
    return null;
  }

  // Validate message structure
  if (!event.data || typeof event.data !== 'object') {
    console.warn('[Security] Rejected message: invalid structure');
    return null;
  }

  // Validate message has a type
  if (!event.data.type || typeof event.data.type !== 'string') {
    console.warn('[Security] Rejected message: missing or invalid type');
    return null;
  }

  return event.data as SafeMessage;
}

/**
 * Safely send postMessage to parent window
 * Detects parent origin when in iframe, defaults to current origin otherwise
 * @param message Message to send
 * @param targetOrigin Target origin (auto-detects parent origin if in iframe)
 */
export function sendSafeMessage(
  message: SafeMessage,
  targetOrigin?: string
): void {
  try {
    // Validate message structure
    if (!message.type || typeof message.type !== 'string') {
      console.error('[Security] Cannot send message without type');
      return;
    }

    // Determine target origin:
    // 1. Use provided targetOrigin if specified
    // 2. If in iframe, try to detect parent origin from referrer
    // 3. Fall back to current origin (safe for same-origin)
    let origin = targetOrigin;
    if (!origin) {
      if (window.self !== window.top && document.referrer) {
        // In iframe: extract origin from referrer
        try {
          origin = new URL(document.referrer).origin;
        } catch {
          origin = window.location.origin;
        }
      } else {
        // Not in iframe or no referrer: use current origin
        origin = window.location.origin;
      }
    }

    // Send to parent only (not broadcast to all frames)
    window.parent.postMessage(message, origin);
  } catch (error) {
    console.error('[Security] Failed to send message:', error);
  }
}
