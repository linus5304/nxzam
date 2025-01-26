import { pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const difficultyLevel = pgEnum("difficulty_level", ['easy', 'medium', 'hard'])
export const examType = pgEnum("exam_type", ['gce_ol', 'gce_al'])
export const practiceType = pgEnum("practice_type", ['self_study', 'guided', 'challenge'])
export const questionStatus = pgEnum("question_status", ['draft', 'review', 'published', 'archived'])
export const userRole = pgEnum("user_role", ['org:student', 'org:teacher', 'org:admin'])

sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`