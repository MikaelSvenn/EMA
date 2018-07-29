import Redlock from 'redlock';

export default (dbClient, options) => new Redlock([dbClient], options);
