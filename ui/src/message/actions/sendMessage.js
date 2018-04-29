export function createSendMessageRequest() {
  return { type: 'SEND_MESSAGE_REQUEST' };
}

export function createSendMessageSuccessful() {
  return { type: 'SEND_MESSAGE_SUCCESSFUL' };
}

export function createSendMessageFailed() {
  return { type: 'SEND_MESSAGE_FAILED' };
}

const sendMessage = api => message => async (dispatch) => {
  dispatch(createSendMessageRequest());
  try {
    const result = await api.postJson({
      type: 'message',
      message,
    });

    if (result.ok) {
      dispatch(createSendMessageSuccessful());
    } else {
      dispatch(createSendMessageFailed());
    }
  } catch (error) {
    dispatch(createSendMessageFailed());
  }
};

export { sendMessage };
