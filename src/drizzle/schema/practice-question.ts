import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, integer, timestamp, foreignKey, primaryKey, check } from "drizzle-orm/pg-core";
import { PracticeSetTable, QuestionTable } from "../schema";

export const PracticeQuestionTable = pgTable("practice_questions", {
	practiceSetId: uuid("practice_set_id").notNull(),
	questionId: uuid("question_id").notNull(),
	questionOrder: integer("question_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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