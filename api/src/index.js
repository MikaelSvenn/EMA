import dotenv from 'dotenv';
import createApi from './app';

dotenv.config({ silent: true });

const api = createApi();
api.listen(process.env.LISTEN_ON);
