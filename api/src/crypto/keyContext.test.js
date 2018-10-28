import keyContextFactory from './keyContext';

describe('Key context', () => {
  let createKey;
  let keyContext;
  let expectedResult;

  beforeEach(() => {
    createKey = jest.fn();
    createKey.mockReturnValue({
      toString: (resultAs) => {
        if (resultAs === 'base64') {
          return `${expectedResult} as base64`;
        }
        throw new Error();
      },
    });

    keyContext = keyContextFactory(createKey);
  });

  describe('on initialization', () => {
    it('should create two keys', () => {
      expect(createKey).toHaveBeenCalledTimes(2);
    });
  });

  describe('should return context with', () => {
    it('session key as base64', () => {
      expectedResult = 'session key';
      expect(keyContext.getSessionKey()).toEqual('session key as base64');
    });

    it('signature key as base64', () => {
      expectedResult = 'signature key';
      expect(keyContext.getSignatureKey()).toEqual('signature key as base64');
    });
  });
});
