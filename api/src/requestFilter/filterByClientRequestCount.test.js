import filterByClientRequestCount from './filterByClientRequestCount';

describe('Filter by client request count', () => {
  let filter;
  let blockTrace;
  let givenClient;
  let trace;

  beforeEach(() => {
    blockTrace = jest.fn();
    filter = filterByClientRequestCount(blockTrace);

    givenClient = {
      requestCount: 20,
    };

    trace = {
      value: {
        lastClient: 'foo',
        clients: {
          foo: givenClient,
        },
      },
    };
  });

  describe('when request count is less than 21', () => {
    beforeEach(async () => {
      await filter(trace);
    });

    it('should not block trace', () => {
      expect(blockTrace).not.toHaveBeenCalled();
    });

    it('should not throw', async () => {
      await expect(filter(trace)).resolves.not.toThrow();
    });
  });

  describe('when request count is over 20', () => {
    it('should block the given client from the given trace and throw', async () => {
      trace.value.clients.foo.requestCount = 21;
      await expect(filter(trace)).rejects.toThrow();
      expect(blockTrace).toHaveBeenCalledWith(trace, 'foo');
    });
  });
});
