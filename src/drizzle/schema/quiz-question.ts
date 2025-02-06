import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { QuizTable } from "./quiz";
import { QuestionTable } from "./question";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const QuizQuestionTable = pgTable("quiz_questions", {
    quizId: uuid("quiz_id").references(() => QuizTable.id),
    questionId: uuid("question_id").references(() => QuestionTable.id),
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