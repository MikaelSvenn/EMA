export default (database, keyContext, hash, createTrace, updateTrace, verifySignature) => async (client) => {
  const traceId = hash(client.ip, keyContext.getSessionKey());
  const lock = await database.lock(traceId);
  let trace = await database.read('trace', traceId);

  if (!trace) {
    trace = createTrace(client);
    await database.insert(trace, 600);
    await lock.unlock();
    return trace;
  }

  verifySignature(trace, keyContext.getSignatureKey());
  trace = updateTrace(trace, client);
  await database.update(trace, 600);

  await lock.unlock();
  return trace;
};
