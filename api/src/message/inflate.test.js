import inflate from './inflate';

describe('Inflate', () => {
  let content;

  beforeEach(() => {
    content = Array.from({ length: 1000 }, inflate);
  });

  it('should return different data on subsequent executions', () => {
    content.forEach((item) => {
      const contentWithoutItem = content.filter(current => current !== item);
      expect(contentWithoutItem.length).toBe(999);
    });
  });

  it('should return data of varying length on subsequent requests', () => {
    content.forEach((item) => {
      const contentWithoutItem = content.filter(current => current.length !== item.length);
      expect(contentWithoutItem.length).toBeGreaterThan(990);
    });
  });

  it('should not return content of less than 5000 characters', () => {
    content.forEach(item => expect(item.length).toBeLessThan(5000));
  });
});
