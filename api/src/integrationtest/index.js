import dotenv from 'dotenv';
import http from './http';
import connectToDatabase from './database';
import decrypt from './decrypt';

dotenv.config({ silent: true, path: '.integrationtest.env' });
const redis = connectToDatabase();

export { http, redis, decrypt };
