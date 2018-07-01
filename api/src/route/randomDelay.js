import crypto from 'crypto';

export default () => {
  let delay = 0;
  while (delay < 10 || delay > 200) {
    const delayPrimitive = crypto.randomBytes(4).readUInt32BE(0);
    delay = delayPrimitive % 155;
  }
  return delay;
};
