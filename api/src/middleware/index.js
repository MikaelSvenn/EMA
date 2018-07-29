import applyHelmet from './helmet';
import applyExceptionHandler from './exceptionHandler';
import applyProxy from './proxy';
import applyRequireUserAgent from './requireUserAgent';
import applyRequestTrace from './trace';

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
  useRequestTrace: (setTrace) => {
    applyRequestTrace(setTrace, expressApplication);
  },
});
