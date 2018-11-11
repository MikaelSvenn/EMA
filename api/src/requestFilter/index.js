import blockTraceFactory from './blockTrace';
import hasNRequestsInGivenTime from './hasNRequestsInGivenTime';
import filterByTraceClientCount from './filterByTraceClientCount';
import filterByClientRequestCount from './filterByClientRequestCount';
import filterByTraceRequestBurst from './filterByTraceRequestBurst';
import filterRequestFactory from './filterRequest';

export default (database, keyContext, hash) => {
  const blockTrace = blockTraceFactory(database, keyContext, hash);
  const filters = [
    filterByTraceClientCount(blockTrace),
    filterByClientRequestCount(blockTrace),
    filterByTraceRequestBurst(blockTrace, hasNRequestsInGivenTime({
      amountOfRequests: 6,
      inMilliseconds: 1000,
    })),
  ];
  const filterRequest = filterRequestFactory(filters);

  return filterRequest;
};
