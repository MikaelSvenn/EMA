import sendMessage from './sendMessage';

describe('Send message reducer', () => {
  describe('Initially', () => {
    let state;

    beforeEach(() => {
      state = sendMessage(undefined, {});
    });

    it('should not indicate message being sent', () => {
      expect(state.isSendingMessage).toBe(false);
    });

    it('should not indicate send failure', () => {
      expect(state.isSendMessageFailed).toBe(false);
    });
  });

  describe('When sending message', () => {
    let state;

    beforeEach(() => {
      state = sendMessage(undefined, { type: 'SEND_MESSAGE_REQUEST' });
    });

    it('should indicate message being sent', () => {
      expect(state.isSendingMessage).toBe(true);
    });

    it('should not indicate send failure', () => {
      expect(state.isSendMessageFailed).toBe(false);
    });
  });

  describe('When message is successfully sent', () => {
    let state;

    beforeEach(() => {
      state = sendMessage(undefined, { type: 'SEND_MESSAGE_SUCCESSFUL' });
    });

    it('should not indicate message being sent', () => {
      expect(state.isSendingMessage).toBe(false);
    });

    it('should not indicate send failure', () => {
      expect(state.isSendMessageFailed).toBe(false);
    });
  });

  describe('When send message fails', () => {
    let state;

    beforeEach(() => {
      state = sendMessage(undefined, { type: 'SEND_MESSAGE_FAILED' });
    });

    it('should not indicate message being sent', () => {
      expect(state.isSendingMessage).toBe(false);
    });

    it('should indicate send failure', () => {
      expect(state.isSendMessageFailed).toBe(true);
    });
  });
});
