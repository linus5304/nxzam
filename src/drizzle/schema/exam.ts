import { sql, relations } from "drizzle-orm";
import { pgTable, uuid, text, jsonb, integer, timestamp, index, foreignKey, check, varchar, boolean } from "drizzle-orm/pg-core";
import { difficultyLevel, ExamAttemptTable, ExamQuestionTable, questionStatus } from "../schema";
import { UserTable } from "./user";
import { SubjectTable } from "./subject";

export const ExamTable = pgTable("exams", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    subjectId: uuid("subject_id").notNull(),
    createdBy: text("created_by").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    passingScore: integer("passing_score").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    index("idx_exams_created_by").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
    index("idx_exams_subject").using("btree", table.subjectId.asc().nullsLast().op("uuid_ops")),
    foreignKey({
        columns: [table.createdBy],
        foreignColumns: [UserTable.id],
        name: "exams_created_by_fkey"
    }),
    foreignKey({
        columns: [table.subjectId],
        foreignColumns: [SubjectTable.id],
        name: "exams_subject_id_fkey"
    }),
    check("exams_duration_minutes_check", sql`duration_minutes > 0`),
    check("exams_passing_score_check", sql`passing_score >= 0`),
]);

export const examsRelations = relations(ExamTable, ({ one, many }) => ({
    user: one(UserTable, {
        fields: [ExamTable.createdBy],
        references: [UserTable.id]
    }),
    subject: one(SubjectTable, {
        fields: [ExamTable.subjectId],
        references: [SubjectTable.id]
    }),
    examAttempts: many(ExamAttemptTable),
    examQuestions: many(ExamQuestionTable),
}));
