import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, timestamp, foreignKey, varchar, text } from "drizzle-orm/pg-core";
import { QuestionTable, UserTable } from "../schema";

export const QuestionReviewTable = pgTable("question_reviews", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    questionId: uuid("question_id").notNull(),
    reviewedBy: text("reviewed_by").notNull(),
    status: varchar({ length: 20 }).notNull(),
    feedback: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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