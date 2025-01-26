import { relations, sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, foreignKey, integer, jsonb, check } from "drizzle-orm/pg-core";
import { UserTable, PracticeSetTable } from "../schema";

export const PracticeAttemptTable = pgTable("practice_attempts", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	practiceSetId: uuid("practice_set_id").notNull(),
	userId: text("user_id").notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	score: integer(),
	answers: jsonb(),
	feedback: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [UserTable.id],
		name: "practice_attempts_user_id_fkey"
	}),
	foreignKey({
		columns: [table.practiceSetId],
		foreignColumns: [PracticeSetTable.id],
		name: "practice_attempts_practice_set_id_fkey"
	}),
	check("practice_attempts_score_check", sql`score >= 0`),
	check("valid_completion", sql`(completed_at IS NULL) OR (completed_at > started_at)`),
]);

export const practiceAttemptsRelations = relations(PracticeAttemptTable, ({ one }) => ({
	user: one(UserTable, {
		fields: [PracticeAttemptTable.userId],
		references: [UserTable.id]
	}),
	practiceSet: one(PracticeSetTable, {
		fields: [PracticeAttemptTable.practiceSetId],
		references: [PracticeSetTable.id]
	}),
}));