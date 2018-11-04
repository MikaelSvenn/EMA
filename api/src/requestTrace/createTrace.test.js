import createTraceFactory from './createTrace';

describe('Create trace should set', () => {
  let hash;
  let result;

  beforeEach(() => {
    hash = jest.fn();
    hash.mockImplementation((content, key) => `${content}-hashedwith-${key}`);

    const keyContext = {
      getSessionKey: () => 'sessionkey',
      getSignatureKey: () => 'signaturekey',
    };

    const createTrace = createTraceFactory(hash, keyContext);
    result = createTrace({
      ip: 'clientIp',
      userAgent: 'currentClientUserAgent',
    }, new Date(2001));
  });

  it('type', () => {
    expect(result.type).toEqual('trace');
  });

  it('key', () => {
    expect(result.key).toEqual('clientIp-hashedwith-sessionkey');
  });

  describe('value with', () => {
    let expectedTimestamp;

    beforeEach(() => {
      expectedTimestamp = new Date(2001).getTime();
    });

    it('createdOn', () => {
      expect(result.value.createdOn).toEqual(expectedTimestamp);
    });

    it('requestCount', () => {
      expect(result.value.requestCount).toEqual(1);
    });

    it('requestsReceivedOn', () => {
      expect(result.value.requestsReceivedOn).toEqual([expectedTimestamp]);
    });

    it('isBlocked', () => {
      expect(result.value.isBlocked).toEqual(false);
    });

    it('errors as empty array', () => {
      expect(result.value.errors).toEqual([]);
    });

    it('given clientId as lastClient', () => {
      expect(result.value.lastClient).toEqual('currentClientUserAgent-hashedwith-sessionkey');
    });

    describe('clients with', () => {
      let client;

      beforeEach(() => {
        client = result.value.clients['currentClientUserAgent-hashedwith-sessionkey'];
      });
      it('requestsReceivedOn', () => {
        expect(client.requestsReceivedOn).toEqual([expectedTimestamp]);
      });

      it('requestCount', () => {
        expect(client.requestCount).toEqual(1);
      });

      it('isBlocked', () => {
        expect(client.isBlocked).toEqual(false);
      });

      it('errors as empty array', () => {
        expect(client.errors).toEqual([]);
      });
    });

    it('signature', () => {
      const content = Object.assign({}, result.value);
      delete content.signature;
      const expectedSignature = `${JSON.stringify(content)}-hashedwith-signaturekey`;
      expect(result.value.signature).toEqual(expectedSignature);
    });
  });
});
