const error = (message) => {
  throw new Error({
    source: 'validation',
    cause: 'messageValidation',
    message,
  });
};

export default (content) => {
  if (content.type !== 'message') {
    error(`incorrect type: ${content.value.type}`);
  }

  if (!content.value.source || content.value.source === '') {
    error('source not defined');
  }

  if (content.value.source.length > 200) {
    error(`source is too long: ${content.value.source.length} characters`);
  }

  if (!content.value.userAgent || content.value.userAgent === '') {
    error('useragent not specified');
  }

  if (content.value.userAgent.length > 200) {
    error(`useragent is too long: ${content.value.userAgent.length} characters`);
  }

  if (!content.value.message || content.value.message === '') {
    error('message has no content');
  }

  if (content.value.message.length > 40000) {
    error(`message is too long: ${content.value.message.length} characters`);
  }
};
