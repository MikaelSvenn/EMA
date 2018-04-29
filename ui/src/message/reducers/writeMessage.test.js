import writeMessage from './writeMessage';

describe('Write message reducer', () => {
  describe('Initially', () => {
    let state;

    beforeEach(() => {
      state = writeMessage(undefined, {});
    });

    it('should not be multiline', () => {
      expect(state.isMultiline).toBe(false);
    });

    it('should not have message', () => {
      expect(state.message).toEqual('');
    });
  });

  describe('When writing message', () => {
    let state;

    beforeEach(() => {
      state = writeMessage(undefined, { type: 'WRITE_MESSAGE', message: 'foo' });
    });

    it('should not change multiline', () => {
      expect(state.isMultiline).toBe(false);
    });

    it('should update the message', () => {
      expect(state.message).toEqual('foo');
    });
  });

  describe('When switching multiline', () => {
    let state;

    beforeEach(() => {
      state = writeMessage(undefined, { type: 'WRITE_MESSAGE', message: 'foo' });
      state = writeMessage(state, { type: 'SWITCH_MULTILINE' });
    });

    it('should not change message', () => {
      expect(state.message).toEqual('foo');
    });

    it('should toggle multiline', () => {
      expect(state.isMultiline).toBe(true);
      state = writeMessage(state, { type: 'SWITCH_MULTILINE' });
      expect(state.isMultiline).toBe(false);
    });
  });

  describe('When send message succeeds', () => {
    let state;

    beforeEach(() => {
      state = writeMessage(undefined, { type: 'SWITCH_MULTILINE' });
      state = writeMessage(state, { type: 'WRITE_MESSAGE', message: 'foo' });
      state = writeMessage(state, { type: 'SEND_MESSAGE_SUCCESSFUL' });
    });

    it('should not toggle multiline', () => {
      expect(state.isMultiline).toBe(true);
    });

    it('should clear the message', () => {
      expect(state.message).toEqual('');
    });
  });
});
