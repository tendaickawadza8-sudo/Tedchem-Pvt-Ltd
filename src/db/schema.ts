import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(), // There will only be one row
  logoUrl: text('logo_url'),
  companyName: text('company_name'),
  aboutUsText: text('about_us_text'),
  address: text('address'),
  phones: text('phones'), // JSON string array
  email: text('email'),
  web3FormsKey: text('web3_forms_key'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').default('new'), // 'new', 'read', 'archived'
  createdAt: timestamp('created_at').defaultNow(),
});
