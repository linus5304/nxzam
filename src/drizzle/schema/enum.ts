import { pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const difficultyLevel = ["easy", "medium", "hard"] as const
export type DifficultyLevel = (typeof difficultyLevel)[number]
export const difficultyLevelEnum = pgEnum("difficulty_level", difficultyLevel)

export const examType = ["gce_ol", "gce_al"] as const
export type ExamType = (typeof examType)[number]
export const examTypeEnum = pgEnum("exam_type", examType)

export const practiceType = ["self_study", "guided", "challenge"] as const
export type PracticeType = (typeof practiceType)[number]
export const practiceTypeEnum = pgEnum("practice_type", practiceType)

export const questionStatus = ["draft", "review", "published", "archived"] as const
export type QuestionStatus = (typeof questionStatus)[number]
export const questionStatusEnum = pgEnum("question_status", questionStatus)

export const userRoles = ["user", "admin"] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum("user_role", userRoles)

sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
