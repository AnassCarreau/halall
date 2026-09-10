import { pgTable, varchar, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { HalalStatus, IngredientConflict } from '@/domain/classification/types';

export const products = pgTable('products', {
  barcode: varchar('barcode', { length: 32 }).primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  status: text('status').$type<HalalStatus>().notNull(),
  hasMeat: boolean('has_meat').default(false).notNull(),
  conflicts: jsonb('conflicts').$type<IngredientConflict[]>().default([]).notNull(),
  explanation: text('explanation'),
  ingredientsText: text('ingredients_text'),
  source: text('source').notNull().default('OFF'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
