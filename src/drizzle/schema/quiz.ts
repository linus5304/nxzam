import { boolean, index, integer, jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { SubjectTable } from "./subject";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { QuizQuestionTable } from "./quiz-question";
import { QuizAttemptTable } from "./quiz-attempts";

export const QuizTable = pgTable('quiz_table', {
    id,
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    subjectId: uuid('subject_id').references(() => SubjectTable.id).notNull(),
    createdBy: text('created_by').references(() => UserTable.clerkUserId).notNull(),
    difficulty: text('difficulty').default('medium').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    topics: text('topics').array().default([]).notNull(),
    totalQuestions: integer('total_questions').notNull(),
    passingScore: integer('passing_score').notNull(),
    quizType: text('quiz_type').default('practice').notNull(),
    metadata: jsonb('metadata').default({}).notNull(),
    createdAt,
    updatedAt,
}, (table) => [
    index("idx_quiz_subject").using("btree", table.subjectId.asc().nullsLast().op("uuid_ops")),
    index("idx_quiz_created_by").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
]);

export const QuizRelations = relations(QuizTable, ({ one, many }) => ({
    subject: one(SubjectTable, {
        fields: [QuizTable.subjectId],
        references: [SubjectTable.id],
    }),
    createdBy: one(UserTable, {
        fields: [QuizTable.createdBy],
        references: [UserTable.id],
    }),
    quizQuestions: many(QuizQuestionTable),
    quizAttempts: many(QuizAttemptTable),
}));    