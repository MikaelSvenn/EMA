import createDbContent from './createDbContent';

describe('Create db content', () => {
  let result;
  let timestamp;
  let content;

  beforeEach(() => {
    content = {
      type: 'foo',
    };

    const hash = jest.fn();
    hash.mockReturnValue('hashed');
    timestamp = new Date(2010, 1, 1);

    const createContent = createDbContent(hash);
    result = createContent(content, timestamp);
  });

  it('should set key', () => {
    expect(result.key).toEqual('foo|hashed');
  });

  describe('value', () => {
    it('should contain type', () => {
      expect(result.value.type).toEqual('foo');
    });

    it('should contain timestamp', () => {
      expect(result.value.timestamp).toEqual(timestamp.getTime());
    });

    it('should contain content', () => {
      expect(result.value.content).toEqual(content);
    });
  });
});
