import createDbContent from './createDbContent';

describe('Create db content', () => {
  let result;
  let timestamp;
  let content;
  let createContent;

  beforeEach(() => {
    content = {
      type: 'foo',
      value: 'bar',
    };

    const hash = jest.fn();
    hash.mockReturnValue('hashed');
    timestamp = new Date(2010, 1, 1);

    createContent = createDbContent(hash);
    result = createContent(content, timestamp);
  });

  describe('key', () => {
    it('should set the given content key', () => {
      content.key = 'givencontentkey';
      result = createContent(content, timestamp);
      expect(result.key).toEqual('foo|givencontentkey');
    });

    it('should set key with content hash when key does not exist', () => {
      expect(result.key).toEqual('foo|hashed');
    });
  });

  describe('value', () => {
    it('should contain timestamp', () => {
      expect(result.value.timestamp).toEqual(timestamp.getTime());
    });

    it('should contain type', () => {
      expect(result.value.type).toEqual('foo');
    });

    it('should contain content', () => {
      expect(result.value.value).toEqual('bar');
    });
  });
});
