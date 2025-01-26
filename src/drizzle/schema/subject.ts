import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, unique } from "drizzle-orm/pg-core";
import { examType, ExamTable, QuestionTable, PracticeSetTable, LearningProgressTable } from "../schema";

export const SubjectTable = pgTable("subjects", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 20 }).notNull(),
    examType: examType("exam_type").notNull(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("subjects_name_code_key").on(table.name, table.code),
]);

export const subjectsRelations = relations(SubjectTable, ({ many }) => ({
    exams: many(ExamTable),
    questions: many(QuestionTable),
    practiceSets: many(PracticeSetTable),
    learningProgresses: many(LearningProgressTable),
}));