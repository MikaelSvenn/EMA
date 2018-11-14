export default (blockTrace, exceedsBurstLimit) => async (trace) => {
  const requests = trace.value.requestsReceivedOn;

  if (exceedsBurstLimit(requests)) {
    await blockTrace(trace);
    throw new Error({
      source: 'filter',
      cause: 'traceRequestBurst',
    });
  }
};
