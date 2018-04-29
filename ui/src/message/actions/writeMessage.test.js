import { writeMessage, switchMultiline } from './writeMessage';

describe('Write message', () => {
  let action;

  beforeEach(() => {
    action = writeMessage();
  });

  it('should set "WRITE_MESSAGE" as type', () => {
    expect(action.type).toEqual('WRITE_MESSAGE');
  });
});

describe('Switch multiline', () => {
  let action;

  beforeEach(() => {
    action = switchMultiline();
  });

  it('should set "SWITCH_MULTILINE" as type', () => {
    expect(action.type).toEqual('SWITCH_MULTILINE');
  });
});
