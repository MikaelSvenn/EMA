import sanitizeJson from './sanitizeJson';

export default {
  json: (request, response, buffer) => {
    sanitizeJson(buffer);
  },
};
