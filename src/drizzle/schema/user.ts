import { relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { ExamTable, QuestionTable, ExamAttemptTable, PracticeSetTable, PracticeAttemptTable, QuestionReviewTable, LearningProgressTable, userRoleEnum } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const UserTable = pgTable("users", {
    id,
    clerkUserId: text("clerk_user_id").notNull(),
    email: varchar({ length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    role: userRoleEnum().notNull().default("user"),
    imageUrl: text("image_url"),
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
}, (table) => [
    unique("users_email_key").on(table.email),
    unique("users_clerk_user_id_key").on(table.clerkUserId),
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