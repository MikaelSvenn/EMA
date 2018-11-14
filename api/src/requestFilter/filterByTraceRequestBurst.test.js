import filterByTraceRequestBurst from './filterByTraceRequestBurst';

describe('Filter by trace request burst should', () => {
  let filter;
  let blockTrace;
  let limitExceeded;
  let trace;

  beforeEach(() => {
    blockTrace = jest.fn();
    limitExceeded = jest.fn();
    limitExceeded.mockReturnValue(false);
    filter = filterByTraceRequestBurst(blockTrace, limitExceeded);
    trace = {
      value: {
        requestsReceivedOn: 'foo',
      },
    };
  });

  it('verify burst limit by requests received on', async () => {
    await expect(filter(trace)).resolves.not.toThrow();
    expect(limitExceeded).toHaveBeenCalledWith('foo');
  });

  it('not block the trace when the burst limit is not exceeded', async () => {
    await expect(filter(trace)).resolves.not.toThrowError({
      source: 'filter',
      cause: 'traceRequestBurst',
    });
    expect(blockTrace).not.toHaveBeenCalled();
  });

  it('block the trace and throw when the burst limit is exceeded', async () => {
    limitExceeded.mockReturnValue(true);
    await expect(filter(trace)).rejects.toThrow();
    expect(blockTrace).toHaveBeenCalledWith(trace);
  });
});
