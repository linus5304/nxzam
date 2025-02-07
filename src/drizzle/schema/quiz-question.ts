import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { QuestionTable } from "./question";
import { QuizTable } from "./quiz";

export const QuizQuestionTable = pgTable("quiz_questions", {
    quizId: uuid("quiz_id").notNull().references(() => QuizTable.id, { onDelete: 'cascade' }),
    questionId: uuid("question_id").notNull().references(() => QuestionTable.id, { onDelete: 'restrict' }),
    createdAt,
    updatedAt,
}, (table) => [
    primaryKey({ columns: [table.quizId, table.questionId] }),
]);

export const QuizQuestionRelations = relations(QuizQuestionTable, ({ one }) => ({
    quiz: one(QuizTable, {
        fields: [QuizQuestionTable.quizId],
        references: [QuizTable.id],
    }),
    question: one(QuestionTable, {
        fields: [QuizQuestionTable.questionId],
        references: [QuestionTable.id],
    }),
}));