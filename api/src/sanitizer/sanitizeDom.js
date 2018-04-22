import createDomPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
const domPurify = createDomPurify(window);
const sanitizerConfig = {
  ALLOWED_TAGS: [],
  KEEP_CONTENT: true,
  ADD_ATTR: [],
  ADD_TAGS: [],
  RETURN_DOM: false,
};

export default (onSanitize, sanitizer = domPurify) => (content) => {
  sanitizer.addHook('uponSanitizeElement', onSanitize);
  sanitizer.addHook('uponSanitizeAttribute', onSanitize);
  sanitizer.addHook('uponSanitizeShadowNode', onSanitize);
  sanitizer.sanitize(content, sanitizerConfig);
};
