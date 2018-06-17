/* eslint no-underscore-dangle: 0 */
import stream from 'stream';

export default () => {
  let contentBuffer = Buffer.from([]);

  const writeStream = new stream.Writable();
  writeStream._write = (chunk, encoding, callback) => {
    const contentChunk = Buffer.from(chunk, encoding);
    contentBuffer = Buffer.concat([contentBuffer, contentChunk]);
    callback();
  };

  return {
    stream: writeStream,
    content: () => contentBuffer,
  };
};
