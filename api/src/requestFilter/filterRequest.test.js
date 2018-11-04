import filterRequestFactory from './filterRequest';

describe('Filter request should', () => {
  let filterRequest;
  let filters;

  beforeEach(() => {
    filters = [
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
    ];

    filters.forEach(filter => filter.mockResolvedValue(new Promise(resolve => setTimeout(resolve, 100))));
    filterRequest = filterRequestFactory(filters);
  });

  it('apply all given filters to the given trace', async () => {
    await filterRequest('given trace');
    filters.every(filter => expect(filter).toHaveBeenCalledWith('given trace'));
  });
});
