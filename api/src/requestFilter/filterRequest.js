export default filterByClientCount => async (trace) => {
  await filterByClientCount(trace);
};
