const initialState = {
  isSendingMessage: false,
  isSendMessageFailed: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_MESSAGE_REQUEST':
      return { ...state, isSendingMessage: true, isSendMessageFailed: false };
    case 'SEND_MESSAGE_SUCCESSFUL':
      return { ...state, isSendingMessage: false, isSendMessageFailed: false };
    case 'SEND_MESSAGE_FAILED':
      return { ...state, isSendingMessage: false, isSendMessageFailed: true };
    default:
      return state;
  }
};
