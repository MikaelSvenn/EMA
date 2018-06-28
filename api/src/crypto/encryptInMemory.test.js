import createEncryptInMemory from './encryptInMemory';
import createReadStream from './createReadStream';
import createWriteStream from './createWriteStream';

describe('Encrypt in memory should', () => {
  let encryptInMemory;
  let readStreamContent;
  let result;

  beforeEach(async () => {
    const encrypt = context => new Promise((resolve) => {
      context.outputStream.on('finish', () => resolve({ foo: 'bar' }));
      context.inputStream.pipe(context.outputStream);
    });

    const createReadStreamSpy = (content) => {
      readStreamContent = content;
      return createReadStream(content);
    };

    encryptInMemory = createEncryptInMemory(encrypt, createReadStreamSpy, createWriteStream);
    result = await encryptInMemory('foobarbaz');
  });

  it('encrypt context with given content', () => {
    expect(readStreamContent).toEqual('"foobarbaz"');
  });

  it('should append encrypted content to output as base64-encoded string', () => {
    const expected = Buffer.from('"foobarbaz"').toString('base64');
    expect(result.data).toEqual(expected);
  });
});
