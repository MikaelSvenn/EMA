export default filters => async (trace) => {
  await Promise.all(filters.map(async filter => filter(trace)));
};
