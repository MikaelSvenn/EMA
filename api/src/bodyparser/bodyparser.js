import parser from 'body-parser';

export default (sanitizer, bodyParser = parser) => ({
  json: () => bodyParser.json({
    inflate: false,
    limit: '50kb',
    strict: true,
    type: 'application/json',
    verify: sanitizer.dom(),
  }),
});
