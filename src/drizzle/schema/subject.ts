import { relations } from "drizzle-orm";
import { pgTable, text, unique, varchar } from "drizzle-orm/pg-core";
import { ExamTable, LearningProgressTable, PracticeSetTable, QuestionTable, examTypeEnum } from "../schema";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const SubjectTable = pgTable("subjects", {
    id,
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 20 }).notNull(),
    examType: examTypeEnum().notNull(),
    description: text(),
    createdAt,
    updatedAt,
}, (table) => [
    unique("subjects_name_code_key").on(table.name, table.code),
]);

export const subjectsRelations = relations(SubjectTable, ({ many }) => ({
    exams: many(ExamTable),
    questions: many(QuestionTable),
    practiceSets: many(PracticeSetTable),
    learningProgresses: many(LearningProgressTable),
}));