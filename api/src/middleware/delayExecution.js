import delay from './randomDelay';

export default (api) => {
  api.use((request, response, nextCallback) => {
    setTimeout(nextCallback, delay());
  });
};
