export default expressApplication => ({
  useRoutes: (routes) => {
    const keys = Object.keys(routes);
    keys.forEach((key) => {
      expressApplication.use(key, routes[key]);
    });
  },
});
