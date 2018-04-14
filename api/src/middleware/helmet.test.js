import helmet from './helmet';

describe('Helmet middleware', () => {
  let api;
  let helmetMock;

  beforeEach(() => {
    api = {
      use: jest.fn(),
    };

    helmetMock = {
      contentSecurityPolicy: jest.fn(),
      dnsPrefetchControl: jest.fn(),
      frameguard: jest.fn(),
      hidePoweredBy: jest.fn(),
      hsts: jest.fn(),
      ieNoOpen: jest.fn(),
      noCache: jest.fn(),
      noSniff: jest.fn(),
      referrerPolicy: jest.fn(),
      xssFilter: jest.fn(),
    };

    helmet(api, helmetMock);
  });

  it('should set CSP', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        upgradeInsecureRequests: true,
      },
    }));
  });

  it('should disallow dns prefetch', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.dnsPrefetchControl());
  });

  it('should disallow content in embedded frames', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.frameguard({ action: 'deny' }));
  });

  it('should set powered-by header', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.hidePoweredBy({ setTo: 'EMA' }));
  });

  it('should enforce http strict transport security ', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.hsts({ maxAge: 31536000 }));
  });

  it('should prevent IE from rendering downloaded content', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.ieNoOpen());
  });

  it('should prevent content caching', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.noCache());
  });

  it('should prevent mime-type guessing', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.noSniff());
  });

  it('should prevent sending referrer information', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.referrerPolicy({ policy: 'no-referrer' }));
  });

  it('should enable helmet xss filter', () => {
    expect(api.use).toHaveBeenCalledWith(helmetMock.xssFilter());
  });
});
