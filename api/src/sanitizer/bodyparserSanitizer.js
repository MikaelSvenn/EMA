import createSanitizer from './sanitizeDom';
import onSanitize from './onSanitize';

export default {
  dom: (request, response, buffer) => {
    const sanitizer = createSanitizer(onSanitize);
    sanitizer.sanitize(buffer.toString('utf8'));
  },
};
