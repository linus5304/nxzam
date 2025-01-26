import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer, jsonb, foreignKey, check, varchar, boolean } from "drizzle-orm/pg-core";
import { PracticeQuestionTable } from "./practice-question";
import { PracticeAttemptTable, SubjectTable, UserTable, practiceType } from "../schema";

export const PracticeSetTable = pgTable("practice_sets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	practiceType: practiceType("practice_type").default('self_study').notNull(),
	subjectId: uuid("subject_id").notNull(),
	createdBy: text("created_by").notNull(),
	topics: text().array().default([""]).notNull(),
	durationMinutes: integer("duration_minutes"),
	isPublic: boolean("is_public").default(false).notNull(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.subjectId],
		foreignColumns: [SubjectTable.id],
		name: "practice_sets_subject_id_fkey"
	}),
	foreignKey({
		columns: [table.createdBy],
		foreignColumns: [UserTable.id],
		name: "practice_sets_created_by_fkey"
	}),
	check("practice_sets_duration_minutes_check", sql`duration_minutes > 0`),
]);

export const practiceSetsRelations = relations(PracticeSetTable, ({ one, many }) => ({
	subject: one(SubjectTable, {
		fields: [PracticeSetTable.subjectId],
		references: [SubjectTable.id]
	}),
	user: one(UserTable, {
		fields: [PracticeSetTable.createdBy],
		references: [UserTable.id]
	}),
	practiceAttempts: many(PracticeAttemptTable),
	practiceQuestions: many(PracticeQuestionTable),
}));