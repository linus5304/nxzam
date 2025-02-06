import { relations, sql } from "drizzle-orm";
import { check, foreignKey, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { difficultyLevelEnum, ExamQuestionTable, PracticeQuestionTable, QuestionReviewTable, questionStatusEnum, SubjectTable, UserTable } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { QuizQuestionTable } from "./quiz-question";

export const QuestionTable = pgTable("questions", {
    id,
    subjectId: uuid("subject_id").notNull(),
    createdBy: uuid("created_by").notNull(),
    questionText: text("question_text").notNull(),
    explanation: text(),
    options: jsonb().notNull(),
    correctAnswer: integer("correct_answer").notNull(),
    difficulty: difficultyLevelEnum().default('medium').notNull(),
    status: questionStatusEnum().default('draft').notNull(),
    tags: text().array().default([""]).notNull(),
    metadata: jsonb().default({}).notNull(),
    createdAt,
    updatedAt,
}, (table) => [
    index("idx_questions_created_by").using("btree", table.createdBy.asc().nullsLast().op("uuid_ops")),
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
    quizQuestions: many(QuizQuestionTable),
}));
