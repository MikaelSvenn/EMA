export default (hash, sessionKey, signatureKey) => (client, timestamp = new Date()) => {
  const clients = {};
  const currentClient = hash(client.userAgent, sessionKey);
  clients[currentClient] = {
    requestsReceivedOn: [timestamp.getTime()],
    requestCount: 1,
    isBlocked: false,
    errors: [],
  };

  const trace = {
    type: 'trace',
    key: hash(client.ip, sessionKey),
    value: {
      createdOn: timestamp.getTime(),
      requestCount: 1,
      requestsReceivedOn: [timestamp.getTime()],
      isBlocked: false,
      errors: [],
      clients,
    },
  };

  const traceContent = JSON.stringify(trace.value);
  trace.value.signature = hash(traceContent, signatureKey);

  return trace;
};
