import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient;

export async function setupCache() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = createClient({ url: redisUrl });
  
  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });
  
  await redisClient.connect();
  console.log('Connected to Redis');
  
  return redisClient;
}

export async function getCachedVerdict(targetWord, guessWord) {
  const key = `verdict:${targetWord.toLowerCase()}:${guessWord.toLowerCase()}`;
  const cachedResult = await redisClient.get(key);
  
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }
  
  return null;
}

export async function cacheVerdict(targetWord, guessWord, result) {
  const key = `verdict:${targetWord.toLowerCase()}:${guessWord.toLowerCase()}`;
  // Cache for 24 hours
  await redisClient.set(key, JSON.stringify(result), { EX: 86400 });
}

export async function getClient() {
  return redisClient;
}