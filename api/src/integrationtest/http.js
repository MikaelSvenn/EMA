/* eslint import/no-extraneous-dependencies: 0 */

import supertest from 'supertest';
import defaults from 'superagent-defaults';
import createPrefix from 'supertest-prefix';
import createApi from '../app';
import configure from '../config';

export default () => {
  const config = configure();
  const api = createApi(config);

  const prefix = createPrefix('/api');
  return defaults(supertest(api)).use(prefix);
};
