export default (hash, sessionKey, signatureKey) => (trace, client, timestamp = new Date()) => {
  const updatedTrace = Object.assign({}, trace);
  delete updatedTrace.value.signature;

  updatedTrace.value.requestCount += 1;
  updatedTrace.value.requestsReceivedOn.push(timestamp.getTime());

  const clientId = hash(client.userAgent, sessionKey);
  const currentClient = updatedTrace.value.clients[clientId];

  if (currentClient) {
    currentClient.requestCount += 1;
    currentClient.requestsReceivedOn.push(timestamp.getTime());
  } else {
    updatedTrace.value.clients[clientId] = {
      requestsReceivedOn: [timestamp.getTime()],
      requestCount: 1,
      isBlocked: false,
      errors: [],
    };
  }

  const traceContent = JSON.stringify(updatedTrace.value);
  updatedTrace.value.signature = hash(traceContent, signatureKey);

  return updatedTrace;
};
