import createReadStream from './createReadStream';

describe('Read stream', () => {
  let readStream;

  beforeEach(() => {
    readStream = createReadStream('readstreamcontent');
    readStream.setEncoding('utf8');
  });

  it('should return the content as stream', () => {
    expect(readStream.read(readStream.length)).toEqual('readstreamcontent');
  });
});
