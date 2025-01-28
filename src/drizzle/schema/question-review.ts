import { relations } from "drizzle-orm";
import { foreignKey, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { QuestionTable, UserTable } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const QuestionReviewTable = pgTable("question_reviews", {
    id,
    questionId: uuid("question_id").notNull(),
    reviewedBy: uuid("reviewed_by").notNull(),
    status: varchar({ length: 20 }).notNull(),
    feedback: text(),
    createdAt,
    updatedAt,
}, (table) => [
    foreignKey({
        columns: [table.questionId],
        foreignColumns: [QuestionTable.id],
        name: "question_reviews_question_id_fkey"
    }),
    foreignKey({
        columns: [table.reviewedBy],
        foreignColumns: [UserTable.id],
        name: "question_reviews_reviewed_by_fkey"
    }),
]);

export const questionReviewsRelations = relations(QuestionReviewTable, ({ one }) => ({
    question: one(QuestionTable, {
        fields: [QuestionReviewTable.questionId],
        references: [QuestionTable.id]
    }),
    user: one(UserTable, {
        fields: [QuestionReviewTable.reviewedBy],
        references: [UserTable.id]
    }),
}));