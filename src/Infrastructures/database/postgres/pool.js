/* istanbul ignore file */
import pg from 'pg';
const { Pool } = pg;
import config from '../../../Commons/config.js';

const pool = new Pool(config.database);

export default pool;