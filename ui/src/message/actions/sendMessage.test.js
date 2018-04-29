import { createSendMessageRequest, createSendMessageSuccessful, createSendMessageFailed, sendMessage } from './sendMessage';

describe('Create send message request', () => {
  let action;

  beforeEach(() => {
    action = createSendMessageRequest();
  });

  it('should set "SEND_MESSAGE_REQUEST" as type', () => {
    expect(action.type).toEqual('SEND_MESSAGE_REQUEST');
  });
});

describe('Create send message successful', () => {
  let action;

  beforeEach(() => {
    action = createSendMessageSuccessful();
  });

  it('should set "SEND_MESSAGE_SUCCESSFUL" as type', () => {
    expect(action.type).toEqual('SEND_MESSAGE_SUCCESSFUL');
  });
});

describe('Create send message failed', () => {
  let action;

  beforeEach(() => {
    action = createSendMessageFailed();
  });

  it('should set "SEND_MESSAGE_FAILED" as type', () => {
    expect(action.type).toEqual('SEND_MESSAGE_FAILED');
  });
});

describe('Send message', () => {
  let api;
  let dispatch;
  let sendMessageThunk;

  beforeEach(async () => {
    api = {
      postJson: jest.fn(),
    };
    api.postJson.mockReturnValue({ ok: 'ok' });
    dispatch = jest.fn();
    sendMessageThunk = sendMessage(api)({ foo: 'bar' });

    await sendMessageThunk(dispatch);
  });

  it('should dispatch send message request', () => {
    expect(dispatch).toHaveBeenCalledWith(createSendMessageRequest());
  });

  it('should post json message', () => {
    expect(api.postJson).toHaveBeenCalledWith({
      type: 'message',
      message: { foo: 'bar' },
    });
  });

  it('should dispatch send message successful when result is ok', () => {
    expect(dispatch).toHaveBeenCalledWith(createSendMessageSuccessful());
  });

  it('should dispatch send message failed when result is not ok', async () => {
    api.postJson.mockReturnValue({ ok: false });
    await sendMessageThunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createSendMessageFailed());
  });

  it('should dispatch send message failed when api throws', async () => {
    api.postJson.mockImplementation(() => { throw new Error('test'); });
    await sendMessageThunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createSendMessageFailed());
  });
});
