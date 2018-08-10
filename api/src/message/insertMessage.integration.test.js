import fs from 'fs';
import { http, redis, decrypt } from '../integrationtest';

describe('POST /message should', () => {
  let initialResult;
  let secondResult;
  let messageKeys;
  let initialMessageContent;
  let initialMessage;
  let currentDate;
  let privateRsaKey;

  beforeAll(async () => {
    currentDate = Date.now();
    initialResult = await http()
      .post('/message')
      .set('user-agent', 'foobarAgent')
      .send({
        message: 'Foobar test message!',
      });

    secondResult = await http()
      .post('/message')
      .set('user-agent', 'foobarAgent')
      .send({
        message: 'Foobar test message!',
      });

    messageKeys = await redis.keysAsync('message*');
    initialMessageContent = await redis.getAsync(messageKeys[0]);
    initialMessage = JSON.parse(initialMessageContent);
    privateRsaKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, { encoding: 'utf8' });
  });

  afterAll(() => {
    redis.flushall();
  });

  it('return http 200', () => {
    expect(initialResult.status).toEqual(200);
    expect(secondResult.status).toEqual(200);
  });

  it('save the received message', async () => {
    expect(messageKeys.length).toEqual(2);
  });

  it('include timestamp', async () => {
    const elapsedMilliseconds = currentDate - initialMessage.timestamp;
    expect(elapsedMilliseconds).toBeLessThan(5000);
  });

  it('include type', () => {
    expect(initialMessage.type).toEqual('message');
  });

  it('not include other root properties than type, timestamp and content', () => {
    expect(Object.keys(initialMessage).length).toEqual(3);
  });

  it('not include other content properties than key, iv, tag and data', () => {
    expect(Object.keys(initialMessage.value).length).toEqual(4);
  });

  it('include key', () => {
    expect(initialMessage.value.key.length).toBeGreaterThan(0);
  });

  it('include initialization vector', () => {
    expect(initialMessage.value.iv.length).toBeGreaterThan(0);
  });

  it('include authentication tag', () => {
    expect(initialMessage.value.tag.length).toBeGreaterThan(0);
  });

  it('encrypt the message', () => {
    expect(initialMessage.value.data.length).toBeGreaterThan(0);
    const nonEncryptedMessage = JSON.stringify({
      message: 'Foobar test message!',
    });
    expect(initialMessage.value.data).not.toEqual(Buffer.from(nonEncryptedMessage).toString('base64'));
  });

  it('encrypt the message encryption key with given public key', () => {
    const encryptedContentBuffer = Buffer.from(initialMessage.value.data, 'base64');
    expect(() => decrypt(privateRsaKey, initialMessage.value, encryptedContentBuffer)).not.toThrow();
  });

  it('result in different ciphertext length with duplicate message', async () => {
    const secondMessageContent = await redis.getAsync(messageKeys[1]);
    const secondMessage = JSON.parse(secondMessageContent);

    expect(initialMessage.value.data.length).not.toEqual(secondMessage.value.data.length);
  });

  it('result in different ciphertext with same duplicate message', async () => {
    const secondMessageContent = await redis.getAsync(messageKeys[1]);
    const secondMessage = JSON.parse(secondMessageContent);

    expect(initialMessage.value.data).not.toEqual(secondMessage.value.data);
  });

  it('include source ip in ciphertext', () => {
    const encryptedContentBuffer = Buffer.from(initialMessage.value.data, 'base64');
    const decryptedMessage = decrypt(privateRsaKey, initialMessage.value, encryptedContentBuffer);
    const decryptedContent = JSON.parse(decryptedMessage);

    expect(decryptedContent.source).toEqual('::ffff:127.0.0.1');
  });

  it('include source user agent in ciphertext', () => {
    const encryptedContentBuffer = Buffer.from(initialMessage.value.data, 'base64');
    const decryptedMessage = decrypt(privateRsaKey, initialMessage.value, encryptedContentBuffer);
    const decryptedContent = JSON.parse(decryptedMessage);

    expect(decryptedContent.userAgent).toEqual('foobarAgent');
  });

  it('include the message content in ciphertext', () => {
    const encryptedContentBuffer = Buffer.from(initialMessage.value.data, 'base64');
    const decryptedMessage = decrypt(privateRsaKey, initialMessage.value, encryptedContentBuffer);
    const decryptedContent = JSON.parse(decryptedMessage);

    expect(decryptedContent.message).toEqual('Foobar test message!');
  });
});
