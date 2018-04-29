export function writeMessage(content) {
  return { type: 'WRITE_MESSAGE', message: content };
}

export function switchMultiline() {
  return { type: 'SWITCH_MULTILINE' };
}
