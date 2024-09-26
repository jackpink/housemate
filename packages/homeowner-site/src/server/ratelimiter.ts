import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "../../../core/env.mjs";

// Using Upstash for performant Redis rate limiting
/*
export const authRateLimit = new Ratelimit({
  redis: new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
});
*/

export const apiRateLimit = new Ratelimit({
  redis: new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(25, "1 m"),
});

// Using in-memory rate limiting

const idToRequestCount = new Map<string, number>();

const authRateLimiter = {
  windowStart: Date.now(),
  windowSize: 60 * 1000, // Milliseconds (currently 1 min)
  maxRequests: 3,
};

export const authRateLimit = (ip: string) => {
  // Check and update current window
  const now = Date.now();
  const isNewWindow =
    now - authRateLimiter.windowStart > authRateLimiter.windowSize;
  if (isNewWindow) {
    authRateLimiter.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  // Check and update current request limits
  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= authRateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};
