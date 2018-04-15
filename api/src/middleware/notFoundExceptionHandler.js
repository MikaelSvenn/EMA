export default(error, response, nextCallback) => {
  if (response.finished || response.headersSent) {
    nextCallback(error);
  } else {
    response.sendStatus(404);
  }
};
