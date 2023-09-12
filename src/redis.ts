import Redis, { type Cluster } from 'ioredis';
import { RedisConfig } from './config';

export class RedisService {
  public _redisClient: Redis | Cluster;

  private constructor(config: RedisConfig) {
    if (config.isCluster) {
      this._redisClient = new Redis.Cluster(config.servers, {
        scaleReads: 'all',
        redisOptions: {
          db: config?.db,
          password: config?.password,
          enableAutoPipelining: true,
        },
      });
    } else {
      this._redisClient = new Redis({
        db: config?.db,
        host: config?.servers[0].host,
        port: config?.servers[0].port,
        password: config?.password,
      });
    }
  }

  /**
    * Add a value to a Redis set and then return number of members in the set after the addition.
    *
    * @param {string} key The key associated with the Redis set.
    * @param {string} value The value to add to the Redis set.
    * @returns {Promise<string[]>} A Promise that resolves to an array of set members as strings.
    */
  async addOneGetCount(key: string, value: string): Promise<number> {
    const res = await this._redisClient.multi().sadd(key, value).scard(key).exec();

    if (res && res[1] && res[1][1]) {
      return res[1][1] as number;
    } else {
      throw new Error('addOneGetAll failed to return properly');
    }
  }

  /**
 * Get the members of a Redis set stored under the given key.
 *
 * @param {string} key The key associated with the Redis set.
 * @returns {Promise<string[]>} A Promise that resolves to an array of set members as strings.
 */
  async getMembers(key: string): Promise<string[]> {
    try {
      const res = await this._redisClient.smembers(key);
      if (!res || res.length === 0) {
        return [];
      }

      return res;
    } catch (err) {
      throw new Error(`Error while getting members on ${key} from Redis`);
    }
  }

}