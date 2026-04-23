import {pgTable, uuid, integer, text, real, date} from 'drizzle-orm/pg-core';

const profiles = pgTable("name_metainfo", {
    id: uuid("id").primaryKey().defaultRandom(), 
    name: text("name").unique().notNull(), 
    gender: text("gender").notNull(), 
    gender_probability: real("gender_probability").notNull(), 
    sample_size: integer("sample_size").notNull(), 
    age: integer("age").notNull(), 
    age_group: text("age_group").notNull(), 
    country_id: text("country_id").notNull(), 
    country_probability: real("country_probability").notNull(), 
    created_at: date("created_at").notNull().defaultNow()
});

type HydratedProfile = typeof profiles.$inferSelect;
type Profile = typeof profiles.$inferInsert;


export type {HydratedProfile, Profile};
export {profiles};