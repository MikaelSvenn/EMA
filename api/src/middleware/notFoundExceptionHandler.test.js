import exceptionHandler from './notFoundExceptionHandler';

describe('notFoundExceptionHandler', () => {
  let response;
  let callback;
  let error;

  beforeEach(() => {
    response = {
      sendStatus: jest.fn(),
    };
    callback = jest.fn();
    error = { foo: 'bar' };
  });

  describe('when response is finished', () => {
    beforeEach(() => {
      response.finished = true;
      exceptionHandler(error, response, callback);
    });

    it('should invoke next callback with error', () => {
      expect(callback).toHaveBeenCalledWith(error);
    });

    it('should not send status', () => {
      expect(response.sendStatus).not.toHaveBeenCalled();
    });
  });

  describe('when response headers are sent', () => {
    beforeEach(() => {
      response.headersSent = true;
      exceptionHandler(error, response, callback);
    });

    it('should invoke next callback with error', () => {
      expect(callback).toHaveBeenCalledWith(error);
    });

    it('should not send status', () => {
      expect(response.sendStatus).not.toHaveBeenCalled();
    });
  });

  it('should send status 404', () => {
    exceptionHandler(error, response, callback);
    expect(response.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should not invoke next callback', () => {
    exceptionHandler(error, response, callback);
    expect(callback).not.toHaveBeenCalled();
  });
});
