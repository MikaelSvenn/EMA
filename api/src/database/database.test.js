import database from './database';

describe('database', () => {
  let options;
  let createClient;
  let dbClient;

  beforeEach(() => {
    options = { foo: 'bar' };
    createClient = jest.fn();
    createClient.mockReturnValue(dbClient);

    dbClient = database(options, createClient);
  });

  it('should create client with options', () => {
    expect(createClient).toHaveBeenCalledWith(options);
  });
});
