import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, text, integer, jsonb, timestamp, foreignKey, check, index } from "drizzle-orm/pg-core";
import { ExamTable, UserTable } from "../schema";

export const ExamAttemptTable = pgTable("exam_attempts", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	examId: uuid("exam_id").notNull(),
	userId: text("user_id").notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	score: integer(),
	answers: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_exam_attempts_exam").using("btree", table.examId.asc().nullsLast().op("uuid_ops")),
	index("idx_exam_attempts_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.examId],
		foreignColumns: [ExamTable.id],
		name: "exam_attempts_exam_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [UserTable.id],
		name: "exam_attempts_user_id_fkey"
	}),
	check("exam_attempts_score_check", sql`score >= 0`),
	check("valid_completion", sql`(completed_at IS NULL) OR (completed_at > started_at)`),
]);

export const examAttemptsRelations = relations(ExamAttemptTable, ({ one }) => ({
	exam: one(ExamTable, {
		fields: [ExamAttemptTable.examId],
		references: [ExamTable.id]
	}),
	user: one(UserTable, {
		fields: [ExamAttemptTable.userId],
		references: [UserTable.id]
	}),
}));