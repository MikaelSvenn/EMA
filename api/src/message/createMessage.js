import validateMessage from './validateMessage';

export default (request, validate = validateMessage) => {
  const message = {
    type: 'message',
    value: {
      source: request.ip,
      userAgent: request.headers['user-agent'],
      message: request.body.message,
    },
  };

  validate(message);
  return message;
};
