const initialState = {
  isMultiline: false,
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'WRITE_MESSAGE':
      return { ...state, message: action.message };
    case 'SWITCH_MULTILINE':
      return { ...state, isMultiline: !state.isMultiline };
    case 'SEND_MESSAGE_SUCCESSFUL':
      return { ...state, message: '' };
    default:
      return state;
  }
};
