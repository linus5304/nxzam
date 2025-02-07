import { relations, sql } from "drizzle-orm";
import { integer, jsonb, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { QuizTable, UserTable } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const QuizAttemptTable = pgTable("quiz_attempts", {
    id,
    quizId: uuid("quiz_id").notNull().references(() => QuizTable.id),
    userId: uuid("user_id").notNull().references(() => UserTable.id),
    startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
    score: integer(),
    answers: jsonb().$type<{
        questionId: string;
        answer: string;
    }[]>(),
    feedback: jsonb().$type<{
        questionId: string;
        feedback: string;
    }[]>(),
    createdAt,
    updatedAt,
}, (table) => [

]);

export const quizAttemptsRelations = relations(QuizAttemptTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [QuizAttemptTable.userId],
        references: [UserTable.id]
    }),
    quiz: one(QuizTable, {
        fields: [QuizAttemptTable.quizId],
        references: [QuizTable.id]
    }),
}));