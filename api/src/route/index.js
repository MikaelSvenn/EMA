export default expressApplication => ({
  useRoutes: (routes) => {
    const keys = Object.keys(routes);
    keys.forEach((key) => {
      expressApplication.use(`/api${key}`, routes[key]);
    });
  },
});
