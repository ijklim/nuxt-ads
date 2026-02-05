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
 * Only sends to the same origin by default
 * @param message Message to send
 * @param targetOrigin Target origin (defaults to parent's origin or current origin)
 */
export function sendSafeMessage(
  message: SafeMessage,
  targetOrigin: string = window.location.origin
): void {
  try {
    // Validate message structure
    if (!message.type || typeof message.type !== 'string') {
      console.error('[Security] Cannot send message without type');
      return;
    }

    // Send to parent only (not broadcast to all frames)
    window.parent.postMessage(message, targetOrigin);
  } catch (error) {
    console.error('[Security] Failed to send message:', error);
  }
}
