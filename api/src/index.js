import dotenv from 'dotenv';
import createApi from './app';
import config from './config';

dotenv.config({ silent: true });

const api = createApi(config);
api.listen(config.server.listenOn);
