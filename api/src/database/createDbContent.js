export default hash => (content, timestamp = new Date()) => {
  const contentHash = hash(JSON.stringify(content));
  return {
    key: `${content.type}|${contentHash}`,
    value: {
      timestamp: timestamp.getTime(),
      content,
    },
  };
};
