export default hash => (content, timestamp = new Date()) => {
  let contentKey;

  if (content.key) {
    contentKey = `${content.type}|${content.key}`;
  } else {
    const contentHash = hash(JSON.stringify(content));
    contentKey = `${content.type}|${contentHash}`;
  }

  return {
    key: contentKey,
    value: {
      timestamp: timestamp.getTime(),
      type: content.type,
      value: content.value,
    },
  };
};
