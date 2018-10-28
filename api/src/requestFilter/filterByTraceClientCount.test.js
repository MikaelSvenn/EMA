import filterByTraceClientCountFactory from './filterByTraceClientCount';

describe('Filter by trace client count', () => {
  let blockTrace;
  let filter;
  let trace;

  beforeEach(() => {
    blockTrace = jest.fn();
    filter = filterByTraceClientCountFactory(blockTrace);
    trace = {
      value: {
        clients: {
          1: null,
          2: null,
          3: null,
          4: null,
        },
      },
    };
  });

  describe('when trace has less than 5 clients', () => {
    it('should not block trace', async () => {
      await filter(trace);
      expect(blockTrace).not.toHaveBeenCalled();
    });

    it('should not throw', async () => {
      await expect(filter(trace)).resolves.not.toThrow();
    });
  });

  describe('when client count limit is exceeded', () => {
    beforeEach(() => {
      trace.value.clients['5'] = null;
    });

    it('should block the trace and throw error', async () => {
      await expect(filter(trace)).rejects.toThrow();
      expect(blockTrace).toHaveBeenCalledWith(trace);
    });
  });
});
