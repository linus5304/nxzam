import { relations, sql } from "drizzle-orm";
import { check, foreignKey, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { PracticeSetTable, QuestionTable } from "../schema";
import { createdAt, updatedAt } from "../schemaHelpers";

export const PracticeQuestionTable = pgTable("practice_questions", {
	practiceSetId: uuid("practice_set_id").notNull(),
	questionId: uuid("question_id").notNull(),
	questionOrder: integer("question_order").notNull(),
	createdAt,
	updatedAt,
}, (table) => [
	foreignKey({
		columns: [table.practiceSetId],
		foreignColumns: [PracticeSetTable.id],
		name: "practice_questions_practice_set_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [QuestionTable.id],
		name: "practice_questions_question_id_fkey"
	}),
	primaryKey({ columns: [table.practiceSetId, table.questionId], name: "practice_questions_pkey" }),
	check("practice_questions_question_order_check", sql`question_order > 0`),
]);

export const practiceQuestionsRelations = relations(PracticeQuestionTable, ({ one }) => ({
	practiceSet: one(PracticeSetTable, {
		fields: [PracticeQuestionTable.practiceSetId],
		references: [PracticeSetTable.id]
	}),
	question: one(QuestionTable, {
		fields: [PracticeQuestionTable.questionId],
		references: [QuestionTable.id]
	}),
}));