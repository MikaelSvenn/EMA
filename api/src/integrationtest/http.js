/* eslint import/no-extraneous-dependencies: 0 */

import supertest from 'supertest';
import defaults from 'superagent-defaults';
import createPrefix from 'supertest-prefix';
import createApi from '../app';
import configure from '../config';

let api;

export default () => {
  if (!api) {
    const config = configure();
    api = createApi(config);
  }

  const prefix = createPrefix('/api');
  return defaults(supertest(api)).use(prefix);
};
