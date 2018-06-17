import validate from './validateMessage';

describe('Validate message', () => {
  let message;
  beforeEach(() => {
    message = {
      type: 'message',
      value: {
        source: 'source',
        userAgent: 'useragent',
        message: 'messageContent',
      },
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
      message.value.source = '';
    });

    it('source is over 200 characters', () => {
      const input = 'a'.repeat(201);
      message.value.source = input;
    });

    it('has no useragent', () => {
      message.value.userAgent = '';
    });

    it('useragent is over 200 characters', () => {
      const input = 'a'.repeat(201);
      message.value.userAgent = input;
    });

    it('has no content', () => {
      message.value.message = '';
    });

    it('content is over 40000 characters', () => {
      const input = 'a'.repeat(40001);
      message.value.message = input;
    });
  });
});
