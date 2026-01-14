/**
 * Simple in-memory rate limiter for account creation
 *
 * Note: In serverless environments, this provides limited protection
 * because each instance has its own memory. For stronger protection,
 * consider using Vercel KV or Redis.
 *
 * However, this still provides meaningful protection:
 * - Stops automated scripts hitting the same instance
 * - Slows down abuse attempts
 * - Works well for single-instance deployments
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ACCOUNTS_PER_IP = 3;
const MAX_ACCOUNTS_PER_EMAIL_DOMAIN = 5; // Per email domain per day

// Cleanup old entries periodically
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if an action is rate limited
 * @param key - Unique identifier (e.g., IP address, email domain)
 * @param limit - Maximum number of actions allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining count
 */
export function checkRateLimit(
  key: string,
  limit: number = MAX_ACCOUNTS_PER_IP,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Check rate limit for account creation by IP
 */
export function checkAccountCreationByIP(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const key = `account_creation_ip:${ip}`;
  return checkRateLimit(key, MAX_ACCOUNTS_PER_IP, RATE_LIMIT_WINDOW_MS);
}

/**
 * Check rate limit for account creation by email domain
 * This helps prevent abuse from free email services
 */
export function checkAccountCreationByEmailDomain(email: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return { allowed: false, remaining: 0, resetTime: Date.now() };
  }

  // Only limit common free email domains
  const freeDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'protonmail.com',
    'proton.me',
  ];

  if (!freeDomains.includes(domain)) {
    // Don't limit business/custom domains
    return {
      allowed: true,
      remaining: 999,
      resetTime: Date.now() + RATE_LIMIT_WINDOW_MS,
    };
  }

  const key = `account_creation_domain:${domain}`;
  return checkRateLimit(key, MAX_ACCOUNTS_PER_EMAIL_DOMAIN, RATE_LIMIT_WINDOW_MS);
}

/**
 * Get client IP from request headers
 * Works with Vercel/Cloudflare proxies
 */
export function getClientIP(headers: Headers): string {
  // Vercel
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Real IP header
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}
