import createTraceFactory from './createTrace';
import updateTraceFactory from './updateTrace';
import verifySignature from './verifySignature';

export default (database, hash, createKey, createTrace = createTraceFactory, updateTrace = updateTraceFactory, verifyTrace = verifySignature) => {
  const sessionKey = createKey().toString('base64');
  const signatureKey = createKey().toString('base64');
  const create = createTrace(hash, sessionKey, signatureKey);
  const update = updateTrace(hash, sessionKey, signatureKey);
  const verify = verifyTrace(hash);

  return async (client) => {
    const traceId = hash(client.ip, sessionKey);
    const lock = await database.lock(`mutex|${traceId}`);
    let trace = await database.read('trace', traceId);

    if (!trace) {
      trace = create(client);
      const createdTrace = await database.insert(trace, 600);
      await lock.unlock();
      return createdTrace;
    }

    verify(trace, signatureKey);
    trace = update(trace, client);
    const updatedTrace = await database.update(trace, 600);

    await lock.unlock();
    return updatedTrace;
  };
};
