export default () => {
  throw new Error({
    source: 'sanitizer',
    cause: 'contentSanitized',
  });
};
