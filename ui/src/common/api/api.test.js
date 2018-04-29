import createApi from './api';

describe('Api', () => {
  let fetch;
  let fetchOptions;
  let api;

  beforeEach(() => {
    fetch = jest.fn();
    fetch.mockImplementation((url, options) => {
      fetchOptions = {
        url,
        options,
      };
      return Promise.resolve({
        ok: 'ok',
      });
    });

    api = createApi(fetch);
  });

  describe('postJson', () => {
    let content;
    let result;

    beforeEach(async () => {
      content = {
        type: 'foo',
      };
      result = await api.postJson(content);
    });

    it('should set request url by content type', () => {
      expect(fetchOptions.url).toEqual('api/foo');
    });

    it('should set request method', () => {
      expect(fetchOptions.options.method).toEqual('POST');
    });

    it('should set request body', () => {
      expect(fetchOptions.options.body).toEqual(JSON.stringify(content));
    });

    it('should set request header', () => {
      expect(fetchOptions.options.headers.get('Content-Type')).toEqual('application/json');
    });

    it('should return ok when request is successful', () => {
      expect(result.ok).toBeTruthy();
    });

    it('should not return ok when request is not successful', async () => {
      fetch.mockReturnValue({ foo: 'bar' });
      result = await api.postJson(content);

      expect(result.ok).toBeFalsy();
    });
  });
});
