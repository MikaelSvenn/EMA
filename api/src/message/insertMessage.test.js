import insertMessage from './insertMessage';

describe('Insert message', () => {
  let database;
  let createMessage;
  let encrypt;
  let request;
  let response;
  let insert;

  beforeEach(async () => {
    database = {
      insert: jest.fn(),
    };
    createMessage = jest.fn();
    createMessage.mockReturnValue({
      type: 'fooType',
      value: 'messageContent',
    });

    encrypt = jest.fn();
    encrypt.mockResolvedValue('encryptedContent');

    request = 'foo';
    response = {
      sendStatus: jest.fn(),
    };

    insert = insertMessage(database, createMessage, encrypt);
    await insert(request, response);
  });

  it('should create message from request', () => {
    expect(createMessage).toHaveBeenCalledWith(request);
  });

  it('should encrypt the created message', () => {
    expect(encrypt).toHaveBeenCalledWith('messageContent');
  });

  it('should insert the encrypted message', () => {
    expect(database.insert).toHaveBeenCalledWith({
      type: 'fooType',
      value: 'encryptedContent',
    });
  });

  it('should respond with http 200', () => {
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });
});
