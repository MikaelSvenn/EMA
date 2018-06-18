import validateMessage from './validateMessage';
import createRandomData from './inflate';

export default (request, validate = validateMessage, inflate = createRandomData) => {
  const message = {
    type: 'message',
    value: {
      contentFill: inflate(),
      source: request.ip,
      userAgent: request.headers['user-agent'],
      message: request.body.message,
    },
  };

  validate(message);
  return message;
};
