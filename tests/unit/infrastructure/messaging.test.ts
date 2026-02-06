import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateMessageEvent, sendSafeMessage } from '../../../infrastructure/security/messaging';

describe('Safe Messaging', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.origin
    delete (window as any).location;
    window.location = { ...originalLocation, origin: 'https://example.com' } as any;
  });

  afterEach(() => {
    // Restore original window.location to prevent test leakage
    (window as any).location = originalLocation;
  });

  describe('validateMessageEvent', () => {
    it('accepts message from same origin', () => {
      const event = new MessageEvent('message', {
        data: { type: 'ad-dimension', height: 250 },
        origin: 'https://example.com',
      });

      const result = validateMessageEvent(event);
      expect(result).toBeTruthy();
      expect(result?.type).toBe('ad-dimension');
    });

    it('rejects message from different origin', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const event = new MessageEvent('message', {
        data: { type: 'ad-dimension', height: 250 },
        origin: 'https://malicious.com',
      });

      const result = validateMessageEvent(event);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('untrusted origin')
      );

      consoleSpy.mockRestore();
    });

    it('rejects message with invalid structure', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const event = new MessageEvent('message', {
        data: 'not-an-object',
        origin: 'https://example.com',
      });

      const result = validateMessageEvent(event);
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    it('rejects message without type', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const event = new MessageEvent('message', {
        data: { height: 250 },
        origin: 'https://example.com',
      });

      const result = validateMessageEvent(event);
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    it('accepts custom allowed origins', () => {
      const event = new MessageEvent('message', {
        data: { type: 'ad-dimension' },
        origin: 'https://trusted-partner.com',
      });

      const result = validateMessageEvent(event, ['https://trusted-partner.com']);
      expect(result).toBeTruthy();
    });
  });

  describe('sendSafeMessage', () => {
    it('sends message to parent window', () => {
      const postMessageSpy = vi.spyOn(window.parent, 'postMessage');

      const message = { type: 'ad-dimension', height: 250, width: 300 };
      sendSafeMessage(message);

      expect(postMessageSpy).toHaveBeenCalledWith(
        message,
        'https://example.com'
      );

      postMessageSpy.mockRestore();
    });

    it('rejects message without type', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const postMessageSpy = vi.spyOn(window.parent, 'postMessage');

      sendSafeMessage({ height: 250 } as any);

      expect(postMessageSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('without type')
      );

      errorSpy.mockRestore();
      postMessageSpy.mockRestore();
    });

    it('handles postMessage errors gracefully', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const postMessageSpy = vi
        .spyOn(window.parent, 'postMessage')
        .mockImplementation(() => {
          throw new Error('postMessage failed');
        });

      sendSafeMessage({ type: 'test' });

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send message'),
        expect.any(Error)
      );

      errorSpy.mockRestore();
      postMessageSpy.mockRestore();
    });
  });
});
