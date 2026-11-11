import { describe, expect, it } from 'vitest';
import { isSameOrigin } from './origin';

describe('isSameOrigin', () => {
  it('accepts requests without an Origin and requests from the same host', () => {
    expect(isSameOrigin(null, 'www.victorhanert.com')).toBe(true);
    expect(isSameOrigin('https://www.victorhanert.com', 'www.victorhanert.com')).toBe(true);
    expect(isSameOrigin('http://localhost:3000', 'localhost:3000')).toBe(true);
  });

  it('rejects other sites, look-alike hosts and malformed origins', () => {
    expect(isSameOrigin('https://evil.example', 'www.victorhanert.com')).toBe(false);
    expect(isSameOrigin('https://www.victorhanert.com.evil.example', 'www.victorhanert.com')).toBe(false);
    expect(isSameOrigin('not a url', 'www.victorhanert.com')).toBe(false);
    expect(isSameOrigin('https://www.victorhanert.com', undefined)).toBe(false);
  });
});
