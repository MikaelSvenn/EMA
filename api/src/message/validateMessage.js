const error = (cause) => {
  throw new Error(`Message validation error - ${cause}`);
};

export default (content) => {
  if (content.type !== 'message') {
    error(`incorrect type: ${content.type}`);
  }

  if (!content.source || content.source === '') {
    error('source not defined');
  }

  if (content.source.length > 200) {
    error(`source is too long: ${content.source.length} characters`);
  }

  if (!content.userAgent || content.userAgent === '') {
    error('useragent not specified');
  }

  if (content.userAgent.length > 200) {
    error(`useragent is too long: ${content.userAgent.length} characters`);
  }

  if (!content.message || content.message === '') {
    error('message has no content');
  }

  if (content.message.length > 40000) {
    error(`message is too long: ${content.message.length} characters`);
  }
};
