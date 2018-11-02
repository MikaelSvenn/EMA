import applyHelmet from './helmet';
import applyExceptionHandler from './exceptionHandler';
import applyProxy from './proxy';
import applyRequireUserAgent from './requireUserAgent';
import applyRequestTrace from './requestTrace';
import applyRequestFilter from './requestFilter';
import preventBlockedClients from './preventBlockedClients';

export default expressApplication => ({
  useHelmet: () => {
    applyHelmet(expressApplication);
  },
  useExceptionHandler: () => {
    applyExceptionHandler(expressApplication);
  },
  useProxy: () => {
    applyProxy(expressApplication);
  },
  requireUserAgent: () => {
    applyRequireUserAgent(expressApplication);
  },
  useRequestTrace: (traceRequest) => {
    applyRequestTrace(traceRequest, expressApplication);
  },
  useRequestFilter: (filterRequest) => {
    applyRequestFilter(filterRequest, expressApplication);
  },
  preventBlockedClients: () => {
    preventBlockedClients(expressApplication);
  },
});
