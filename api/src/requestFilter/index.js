import blockTraceFactory from './blockTrace';
import filterByTraceClientCount from './filterByTraceClientCount';
import filterByClientRequestCount from './filterByClientRequestCount';
import filterRequestFactory from './filterRequest';

export default (database, keyContext, hash) => {
  const blockTrace = blockTraceFactory(database, keyContext, hash);
  const filters = [
    filterByTraceClientCount(blockTrace),
    filterByClientRequestCount(blockTrace),
  ];
  const filterRequest = filterRequestFactory(filters);

  return filterRequest;
};
