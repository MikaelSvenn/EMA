export default blockTrace => async (trace) => {
  const currentClient = trace.value.clients[trace.value.lastClient];
  if (currentClient.requestCount > 20) {
    await blockTrace(trace, trace.value.lastClient);
    throw new Error('Client blocked: request exceeded.');
  }
};
