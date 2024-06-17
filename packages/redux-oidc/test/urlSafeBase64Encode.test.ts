import { TextEncoder } from 'node:util';

import { urlSafeBase64Encode } from '../src/utils';

const stringToBuffer = (input: string): Uint8Array => {
  return new TextEncoder().encode(input);
};

describe('urlSafeBase64Encode', () => {
  it('should encode a Uint8Array to a URL-safe Base64 string', () => {
    const buffer = stringToBuffer('opentalk');
    const encoded = urlSafeBase64Encode(buffer);
    expect(encoded).toBe('b3BlbnRhbGs');
  });

  it('should produce a URL-safe Base64 string without characters like "\\", "+" or "="', () => {
    const longString = 'A'.repeat(64);
    const buffer = stringToBuffer(longString);
    const encoded = urlSafeBase64Encode(buffer);
    expect(encoded).not.toMatch(/[\\+/=]/);
  });
});
