import blockTraceFactory from './blockTrace';
import filterByTraceClientCountFactory from './filterByTraceClientCount';
import filterRequestFactory from './filterRequest';

export default (database, keyContext, hash) => {
  const blockTrace = blockTraceFactory(database, keyContext, hash);

  const filterByTraceClientCount = filterByTraceClientCountFactory(blockTrace);
  const filterRequest = filterRequestFactory(filterByTraceClientCount);

  return filterRequest;
};

