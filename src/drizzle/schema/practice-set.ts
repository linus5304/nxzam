import { relations, sql } from "drizzle-orm";
import { boolean, check, foreignKey, integer, jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { PracticeAttemptTable, SubjectTable, UserTable, practiceTypeEnum } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { PracticeQuestionTable } from "./practice-question";

export const PracticeSetTable = pgTable("practice_sets", {
	id,
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	practiceType: practiceTypeEnum().default('self_study').notNull(),
	subjectId: uuid("subject_id").notNull(),
	createdBy: uuid("created_by").notNull(),
	topics: text().array().default([""]).notNull(),
	durationMinutes: integer("duration_minutes"),
	isPublic: boolean("is_public").default(false).notNull(),
	metadata: jsonb().default({}),
	createdAt,
	updatedAt,
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