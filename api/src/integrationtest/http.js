/* eslint import/no-extraneous-dependencies: 0 */

import supertest from 'supertest';
import defaults from 'superagent-defaults';
import createPrefix from 'supertest-prefix';
import Throttle from 'superagent-throttle';
import createApi from '../app';
import configure from '../config';

let api;

const prefix = createPrefix('/api');
const throttle = new Throttle({
  active: true,
  rate: 4,
  ratePer: 1000,
  concurrent: 1,
});

export default (options = { avoidTraceBurst: true }) => {
  if (!api) {
    const config = configure();
    api = createApi(config);
  }

  if (options.avoidTraceBurst === false) {
    return defaults(supertest(api)).use(prefix);
  }

  return defaults(supertest(api)).use(prefix).use(throttle.plugin());
};
