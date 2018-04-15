import applyHelmet from './helmet';
import applyExceptionHandler from './exceptionHandler';

export default expressApplication => ({
  useHelmet: () => {
    applyHelmet(expressApplication);
  },
  useExceptionHandler: () => {
    applyExceptionHandler(expressApplication);
  },
});
