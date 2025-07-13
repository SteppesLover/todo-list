import { describe, expect, it } from 'vitest';
import App from './App';

describe('App test suite', () => {
  it('1 plus 1 equals 2', () => {
    expect(1 + 1).toEqual(2);
  });

  it('expect up to not equal down', () => {
    expect('up' !== 'down').toBe(true);
  });

  it('expect up to equal down', () => {
    expect('up').toEqual('down');
  });
});