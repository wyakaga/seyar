import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { v7 as uuidv7 } from 'uuid';

export const items = sqliteTable('items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  price: real('price').notNull(),
  timeCost: real('time_cost').notNull(),
  status: text('status', {
    enum: ['anchored', 'purchased', 'rejected'],
  }).notNull(),
  reviewStatus: text('review_status', {
    enum: ['pending', 'loved', 'regretted'],
  }).default('pending'),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }),
  purchasedAt: integer('purchased_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type Item = typeof items.$inferSelect;
