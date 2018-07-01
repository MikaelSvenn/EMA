import randomDelay from './randomDelay';

describe('Random delay should', () => {
  let delays;

  beforeEach(() => {
    delays = Array.from({ length: 1000 }, randomDelay);
  });

  it('return a delay between 10 and 200ms', () => {
    delays.forEach((delay) => {
      expect(delay).toBeGreaterThan(9);
      expect(delay).toBeLessThan(201);
    });
  });

  it('return different delay on subsequent calls', () => {
    delays.forEach((delay) => {
      const delaysWithoutItem = delays.filter(current => current !== delay);
      expect(delaysWithoutItem.length).toBeGreaterThan(900);
    });
  });
});
