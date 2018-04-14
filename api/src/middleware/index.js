import applyHelmet from './helmet';

export default expressApplication => ({
  useHelmet: () => {
    applyHelmet(expressApplication);
  },
});
