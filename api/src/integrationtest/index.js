import dotenv from 'dotenv';
import http from './http';
import ping from './ping';
import connectToDatabase from './database';
import decrypt from './decrypt';

dotenv.config({ silent: true, path: '.integrationtest.env' });
const redis = connectToDatabase();

const pingTimes = ping(http);

export { http, redis, decrypt, pingTimes };
