import verifyTraceFactory from './verifyTrace';
import createHash from '../crypto/hash';

describe('Verify trace signature', () => {
  let content;
  let key;
  let verifySignature;

  beforeEach(() => {
    key = 'foobarbazsignaturekey';
    content = {
      value: {
        foobar: 'baz',
        baz: [42, true],
      },
    };

    const hash = createHash();
    content.value.signature = hash(JSON.stringify(content.value), key);

    verifySignature = verifyTraceFactory(hash);
  });

  it('should not throw when signature matches with content', () => {
    expect(() => verifySignature(content, key)).not.toThrow();
  });

  it('should throw when signature does not match with content', () => {
    content.value.foobar = 'bar';
    expect(() => verifySignature(content, key)).toThrowError('traceSignatureMismatch');
  });
});
