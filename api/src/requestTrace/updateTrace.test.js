import createTraceFactory from './createTrace';
import updateTraceFactory from './updateTrace';

describe('Update trace', () => {
  let updateTrace;
  let trace;
  let result;

  beforeEach(() => {
    const hash = jest.fn();
    hash.mockImplementation((content, key) => `${content}-${key}`);
    const keyContext = {
      getSessionKey: () => 'sessionkey',
      getSignatureKey: () => 'signaturekey',
    };

    const createTrace = createTraceFactory(hash, keyContext);
    updateTrace = updateTraceFactory(hash, keyContext);
    trace = createTrace({
      ip: 'foobarip',
      userAgent: 'foobaragent',
    }, new Date(2001));
  });

  it('should increase trace requestCount by one', () => {
    result = updateTrace(trace, {}, new Date(2002));
    expect(result.value.requestCount).toEqual(2);
  });

  it('should append timestamp to trace requestsReceivedOn', () => {
    result = updateTrace(trace, {}, new Date(2002));
    expect(result.value.requestsReceivedOn).toEqual([
      new Date(2001).getTime(),
      new Date(2002).getTime(),
    ]);
  });

  it('should preserve trace key', () => {
    result = updateTrace(trace, {}, new Date(2002));
    expect(result.key).toEqual(trace.key);
  });

  describe('when client does not exist should', () => {
    beforeEach(() => {
      result = updateTrace(trace, {
        userAgent: 'barfooagent',
      }, new Date(2003));
    });

    describe('create client with', () => {
      let client;

      beforeEach(() => {
        client = result.value.clients['barfooagent-sessionkey'];
      });

      it('requestsReceivedOn', () => {
        expect(client.requestsReceivedOn).toEqual([new Date(2003).getTime()]);
      });

      it('requestCount', () => {
        expect(client.requestCount).toEqual(1);
      });

      it('isBlocked', () => {
        expect(client.isBlocked).toEqual(false);
      });

      it('errors', () => {
        expect(client.errors).toEqual([]);
      });
    });

    it('sign the trace', () => {
      const signedContent = Object.assign({}, result.value);
      delete signedContent.signature;

      const expectedSignature = `${JSON.stringify(signedContent)}-signaturekey`;
      expect(result.value.signature).toEqual(expectedSignature);
    });
  });

  describe('when client exists should', () => {
    let client;

    beforeEach(() => {
      trace.value.clients['foobaragent-sessionkey'].errors.push('foo');
      trace.value.clients['foobaragent-sessionkey'].isBlocked = true;
      result = updateTrace(trace, {
        userAgent: 'foobaragent',
      }, new Date(2003));

      client = result.value.clients['foobaragent-sessionkey'];
    });

    it('increase client requestCount by one', () => {
      expect(client.requestCount).toEqual(2);
    });

    it('append timestamp to client requestsReceivedOn', () => {
      expect(client.requestsReceivedOn).toEqual([
        new Date(2001).getTime(),
        new Date(2003).getTime(),
      ]);
    });

    it('preserve isBlocked', () => {
      expect(client.isBlocked).toEqual(true);
    });

    it('preserve errors', () => {
      expect(client.errors).toEqual(['foo']);
    });

    it('sign the trace', () => {
      const signedContent = Object.assign({}, result.value);
      delete signedContent.signature;

      const expectedSignature = `${JSON.stringify(signedContent)}-signaturekey`;
      expect(result.value.signature).toEqual(expectedSignature);
    });
  });
});
