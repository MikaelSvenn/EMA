import helmetInstance from 'helmet';

export default (api, helmet = helmetInstance) => {
  api.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      upgradeInsecureRequests: true,
    },
  }));
  api.use(helmet.dnsPrefetchControl());
  api.use(helmet.frameguard({ action: 'deny' }));
  api.use(helmet.hidePoweredBy({ setTo: 'EMA' }));
  api.use(helmet.hsts({ maxAge: 31536000 }));
  api.use(helmet.ieNoOpen());
  api.use(helmet.noCache());
  api.use(helmet.noSniff());
  api.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
  api.use(helmet.xssFilter());
};
