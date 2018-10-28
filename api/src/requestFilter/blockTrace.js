export default (database, keyContext, hash) => async (trace, clientId) => {
  const lock = await database.lock(trace.key);

  const blockedTrace = Object.assign({}, trace);
  delete blockedTrace.value.signature;

  if (clientId) {
    blockedTrace.value.clients[clientId].isBlocked = true;
  } else {
    blockedTrace.value.isBlocked = true;
  }

  const content = JSON.stringify(blockedTrace.value);
  blockedTrace.value.signature = hash(content, keyContext.getSignatureKey());

  await database.update(blockedTrace, 432000);
  await lock.unlock();

  return blockedTrace;
};
