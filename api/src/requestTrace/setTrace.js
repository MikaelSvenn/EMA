import createTraceFactory from './createTrace';
import updateTraceFactory from './updateTrace';

export default (database, hash, createKey, createTrace = createTraceFactory, updateTrace = updateTraceFactory) => {
  const sessionKey = createKey().toString('base64');
  const signatureKey = createKey().toString('base64');
  const create = createTrace(hash, sessionKey, signatureKey);
  const update = updateTrace(hash, sessionKey, signatureKey);

  return async (client) => {
    const traceId = hash(client.ip, sessionKey);
    let trace = await database.read('trace', traceId);

    if (!trace) {
      trace = create(client);
      return database.insert(trace);
    }

    trace = update(trace, client);
    return database.update(trace);
  };
};
