import notFoundExceptionHandler from './notFoundExceptionHandler';

export default (api) => {
  api.use((error, request, response, nextCallback) => {
    notFoundExceptionHandler(error, response, nextCallback);
  });
};
