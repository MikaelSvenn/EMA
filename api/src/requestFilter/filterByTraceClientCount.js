export default blockTrace => async (trace) => {
  const clientCount = Object.keys(trace.value.clients).length;
  if (clientCount >= 5) {
    await blockTrace(trace);
    throw new Error({
      source: 'filter',
      cause: 'traceClientCount',
    });
  }
};
