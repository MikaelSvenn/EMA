import validate from './validateMessage';

describe('Validate message', () => {
  let message;
  beforeEach(() => {
    message = {
      type: 'message',
      source: 'source',
      userAgent: 'useragent',
      message: 'message',
    };
  });

  it('should not throw when message is valid', () => {
    expect(() => validate(message)).not.toThrow();
  });

  describe('should throw when message', () => {
    afterEach(() => {
      expect(() => validate(message)).toThrow();
    });

    it('has type other than "message"', () => {
      message.type = '?';
    });

    it('has no source', () => {
      message.source = '';
    });

    it('source is over 200 characters', () => {
      const input = 'a'.repeat(201);
      message.source = input;
    });

    it('has no useragent', () => {
      message.userAgent = '';
    });

    it('useragent is over 200 characters', () => {
      const input = 'a'.repeat(201);
      message.userAgent = input;
    });

    it('has no content', () => {
      message.message = '';
    });

    it('content is over 40000 characters', () => {
      const input = 'a'.repeat(40001);
      message.message = input;
    });
  });
});
