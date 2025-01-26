import { relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { userRole, ExamTable, QuestionTable, ExamAttemptTable, PracticeSetTable, PracticeAttemptTable, QuestionReviewTable, LearningProgressTable } from "../schema";

export const UserTable = pgTable("users", {
    id: text('id').primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRole().default('org:student').notNull(),
    profileImageUrl: text("profile_image_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("users_email_key").on(table.email),
]);

export const usersRelations = relations(UserTable, ({ many }) => ({
    exams: many(ExamTable),
    questions: many(QuestionTable),
    examAttempts: many(ExamAttemptTable),
    practiceSets: many(PracticeSetTable),
    practiceAttempts: many(PracticeAttemptTable),
    questionReviews: many(QuestionReviewTable),
    learningProgresses: many(LearningProgressTable),
}));