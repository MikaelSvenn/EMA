import dotenv from 'dotenv';
import createApi from './app';
import configure from './config';

dotenv.config({ silent: true });
const config = configure();
const api = createApi(config);
api.listen(config.server.listenOn);
