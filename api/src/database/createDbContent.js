export default hash => (content, timestamp = Date.now()) => {
  const contentHash = hash(content);

  return {
    key: `${content.type}|${contentHash}`,
    value: {
      type: content.type,
      timestamp: timestamp.getTime(),
      content,
    },
  };
};
