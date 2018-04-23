export default messageDto => ({
  key: `message|${(new Date()).getTime()}`,
  value: messageDto.message,
});
