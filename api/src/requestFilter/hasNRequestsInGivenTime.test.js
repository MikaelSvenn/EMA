import hasRequests from './hasNRequestsInGivenTime';

describe('Has N requests in given time', () => {
  let requests;
  let currentDate;

  beforeEach(() => {
    currentDate = Date.now();
    requests = [
      new Date(currentDate).getTime(),
      new Date(currentDate + 100).getTime(),
      new Date(currentDate + 500).getTime(),
      new Date(currentDate + 900).getTime(),
    ];
  });

  it('should return true when the given amount of requests has occurred within the given time', () => {
    const hasFourRequestsInSecond = hasRequests({
      amountOfRequests: 4,
      inMilliseconds: 1000,
    })(requests);

    expect(hasFourRequestsInSecond).toEqual(true);
  });

  it('should return true when the given amount of requests has occurred excatly within the given time', () => {
    const hasFourRequestsInSecond = hasRequests({
      amountOfRequests: 4,
      inMilliseconds: 900,
    })(requests);

    expect(hasFourRequestsInSecond).toEqual(true);
  });

  it('should return false when the given amount of requests has not occurred within the given time', () => {
    const hasFourRequestsIn800ms = hasRequests({
      amountOfRequests: 4,
      inMilliseconds: 800,
    })(requests);

    expect(hasFourRequestsIn800ms).toEqual(false);
  });

  it('should return false when request count is less than the given amount of requests', () => {
    const hasFiveRequestsInSecond = hasRequests({
      amountOfRequests: 5,
      inMilliseconds: 1000,
    })(requests);

    expect(hasFiveRequestsInSecond).toEqual(false);
  });
});
