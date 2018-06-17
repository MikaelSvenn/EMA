/* eslint no-underscore-dangle: 0 */
import stream from 'stream';

export default (content) => {
  const readStream = new stream.Readable();
  readStream._read = () => { };
  readStream.push(content);
  readStream.push(null);

  return readStream;
};
