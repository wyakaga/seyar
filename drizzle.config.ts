import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './src/drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;