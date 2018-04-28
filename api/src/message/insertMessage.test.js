import insertMessage from './insertMessage';

describe('Insert message', () => {
  let database;
  let createMessage;
  let request;
  let response;
  let insert;

  beforeEach(async () => {
    database = {
      insert: jest.fn(),
    };
    createMessage = jest.fn();
    createMessage.mockReturnValue('created message');

    request = 'foo';
    response = {
      sendStatus: jest.fn(),
    };

    insert = insertMessage(database, createMessage);
    await insert(request, response);
  });

  it('should should create message from request', () => {
    expect(createMessage).toHaveBeenCalledWith(request);
  });

  it('should insert the dbContent', () => {
    expect(database.insert).toHaveBeenCalledWith('created message');
  });

  it('should respond with http 200', () => {
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });
});
