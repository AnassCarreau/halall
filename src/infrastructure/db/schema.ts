import { pgTable, varchar, text, boolean, jsonb, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
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

export const locales = pgTable('locales', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: text('name').notNull(),
  type: varchar('type', { length: 32 }).$type<'carniceria' | 'restaurante'>().notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  halalCertified: boolean('halal_certified').default(true).notNull(),
  certifierName: text('certifier_name'),
  verified: boolean('verified').default(false).notNull(),
  googleMapsUrl: text('google_maps_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Locale = typeof locales.$inferSelect;
export type NewLocale = typeof locales.$inferInsert;
