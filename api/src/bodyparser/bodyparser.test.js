import bodyparser from './bodyparser';

describe('bodyparser', () => {
  let parserInstance;
  let parser;

  beforeEach(() => {
    const sanitizer = {
      json: jest.fn(),
    };
    parserInstance = {
      json: jest.fn(),
    };

    sanitizer.json.mockReturnValue('jsonsanitizer');
    parserInstance.json.mockImplementation(options => options);

    parser = bodyparser(sanitizer, parserInstance);
  });

  describe('json', () => {
    let actualOptions;

    beforeEach(() => {
      actualOptions = parser.json();
    });

    it('should not use inflate', () => {
      expect(actualOptions.inflate).toBe(false);
    });

    it('should limit body size to 50kb', () => {
      expect(actualOptions.limit).toEqual('50kb');
    });

    it('should use strict json parsing', () => {
      expect(actualOptions.strict).toBe(true);
    });

    it('should parse application/json MIME type', () => {
      expect(actualOptions.type).toEqual('application/json');
    });

    it('should use json sanitizer', () => {
      expect(actualOptions.verify).toEqual('jsonsanitizer');
    });
  });
});
