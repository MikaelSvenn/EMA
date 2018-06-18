import crypto from 'crypto';

export default () => {
  const lengthPrimitive = crypto.randomBytes(4).readUInt32BE(0);
  const inflateLength = lengthPrimitive % 2500;

  const buffer = Buffer.alloc(inflateLength);
  crypto.randomFillSync(buffer);

  return buffer.toString('base64');
};
