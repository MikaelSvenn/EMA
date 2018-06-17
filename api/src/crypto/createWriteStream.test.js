/* eslint no-underscore-dangle: 0 */
import createWriteStream from './createWriteStream';

describe('Write stream', () => {
  let writeStream;

  beforeEach(() => {
    writeStream = createWriteStream();
  });

  it('should write to memory', () => {
    writeStream.stream._write('foobarcontent', 'utf8', () => {
      expect(writeStream.content().toString()).toEqual('foobarcontent');
    });
  });
});
