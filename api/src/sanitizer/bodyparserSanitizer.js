import createSanitizer from './sanitizeDom';
import onSanitize from './onSanitize';

export default {
  dom: (request, response, buffer) => {
    const sanitize = createSanitizer(onSanitize);
    sanitize(buffer.toString('utf8'));
  },
};
