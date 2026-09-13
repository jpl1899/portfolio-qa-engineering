import process from 'node:process';

/**
 * Single source of truth for environment configuration.
 *
 * Nothing else in the codebase reads `process.env` directly — every URL,
 * port and credential is resolved here from `.env` (see `.env.example`).
 * Exact values for the local Toolshop are pinned in `sut/docker-compose.yml`.
 */

function env(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

/** Throw if a variable that has no safe default is missing. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var "${name}". Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const config = {
  sut: {
    webUrl: env('SUT_WEB_URL', 'http://localhost:8091'),
    apiUrl: env('SUT_API_URL', 'http://localhost:8091'),
  },
  db: {
    host: env('DB_HOST', '127.0.0.1'),
    port: Number(env('DB_PORT', '3306')),
    user: env('DB_USER', 'root'),
    password: env('DB_PASSWORD', 'root'),
    database: env('DB_NAME', 'toolshop'),
  },
  users: {
    admin: {
      email: env('ADMIN_EMAIL', 'admin@practicesoftwaretesting.com'),
      password: env('ADMIN_PASSWORD', 'welcome01'),
    },
    customer: {
      email: env('CUSTOMER_EMAIL', 'customer@practicesoftwaretesting.com'),
      password: env('CUSTOMER_PASSWORD', 'welcome01'),
    },
  },
} as const;

export type Config = typeof config;
