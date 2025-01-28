import { relations, sql } from "drizzle-orm";
import { boolean, check, foreignKey, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { ExamAttemptTable, ExamQuestionTable } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { SubjectTable } from "./subject";
import { UserTable } from "./user";

export const ExamTable = pgTable("exams", {
    id,
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    subjectId: uuid("subject_id").notNull(),
    createdBy: uuid("created_by").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    passingScore: integer("passing_score").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt,
    updatedAt,
}, (table) => [
    index("idx_exams_created_by").using("btree", table.createdBy.asc().nullsLast().op("uuid_ops")),
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
