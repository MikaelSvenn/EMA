import delay from './randomDelay';

export default (expressApplication) => {
  const delayExecution = async (request, response, next) => {
    setTimeout(next, delay());
  };

  return {
    useRoutes: (routes) => {
      const keys = Object.keys(routes);
      keys.forEach((key) => {
        expressApplication.use(`/api${key}`, delayExecution, routes[key]);
      });
    },
  };
};
