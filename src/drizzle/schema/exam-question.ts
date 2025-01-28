import { relations, sql } from "drizzle-orm";
import { check, foreignKey, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { ExamTable, QuestionTable } from "../schema";
import { createdAt, updatedAt } from "../schemaHelpers";

export const ExamQuestionTable = pgTable("exam_questions", {
	examId: uuid("exam_id").notNull(),
	questionId: uuid("question_id").notNull(),
	questionOrder: integer("question_order").notNull(),
	points: integer().default(1).notNull(),
	createdAt,
	updatedAt,
}, (table) => [
	foreignKey({
		columns: [table.examId],
		foreignColumns: [ExamTable.id],
		name: "exam_questions_exam_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [QuestionTable.id],
		name: "exam_questions_question_id_fkey"
	}),
	primaryKey({ columns: [table.examId, table.questionId], name: "exam_questions_pkey" }),
	check("exam_questions_points_check", sql`points > 0`),
	check("exam_questions_question_order_check", sql`question_order > 0`),
]);

export const examQuestionsRelations = relations(ExamQuestionTable, ({ one }) => ({
	exam: one(ExamTable, {
		fields: [ExamQuestionTable.examId],
		references: [ExamTable.id]
	}),
	question: one(QuestionTable, {
		fields: [ExamQuestionTable.questionId],
		references: [QuestionTable.id]
	}),
}));