import { sql, relations } from "drizzle-orm";
import { uuid, text, timestamp, integer, jsonb, index, foreignKey, check, pgTable, varchar } from "drizzle-orm/pg-core";
import { ExamQuestionTable, difficultyLevel, PracticeQuestionTable, QuestionReviewTable, questionStatus, SubjectTable, UserTable } from "../schema";

export const QuestionTable = pgTable("questions", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    subjectId: uuid("subject_id").notNull(),
    createdBy: text("created_by").notNull(),
    questionText: text("question_text").notNull(),
    explanation: text(),
    options: jsonb().notNull(),
    correctAnswer: integer("correct_answer").notNull(),
    difficulty: difficultyLevel().default('medium').notNull(),
    status: questionStatus().default('draft').notNull(),
    tags: text().array().default([""]).notNull(),
    metadata: jsonb().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    index("idx_questions_created_by").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
    index("idx_questions_difficulty").using("btree", table.difficulty.asc().nullsLast().op("enum_ops")),
    index("idx_questions_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
    index("idx_questions_subject").using("btree", table.subjectId.asc().nullsLast().op("uuid_ops")),
    foreignKey({
        columns: [table.createdBy],
        foreignColumns: [UserTable.id],
        name: "questions_created_by_fkey"
    }),
    foreignKey({
        columns: [table.subjectId],
        foreignColumns: [SubjectTable.id],
        name: "questions_subject_id_fkey"
    }),
    check("valid_correct_answer", sql`(correct_answer >= 0) AND (correct_answer < jsonb_array_length(options))`),
]);

export const questionsRelations = relations(QuestionTable, ({ one, many }) => ({
    user: one(UserTable, {
        fields: [QuestionTable.createdBy],
        references: [UserTable.id]
    }),
    subject: one(SubjectTable, {
        fields: [QuestionTable.subjectId],
        references: [SubjectTable.id]
    }),
    questionReviews: many(QuestionReviewTable),
    practiceQuestions: many(PracticeQuestionTable),
    examQuestions: many(ExamQuestionTable),
}));
