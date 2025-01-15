import { pgTable, unique, uuid, varchar, text, timestamp, index, foreignKey, check, integer, boolean, jsonb, primaryKey, doublePrecision, pgEnum } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"

export const difficultyLevel = pgEnum("difficulty_level", ['easy', 'medium', 'hard'])
export const examType = pgEnum("exam_type", ['gce_ol', 'gce_al'])
export const practiceType = pgEnum("practice_type", ['self_study', 'guided', 'challenge'])
export const questionStatus = pgEnum("question_status", ['draft', 'review', 'published', 'archived'])
export const userRole = pgEnum("user_role", ['org:student', 'org:teacher', 'org:admin'])

sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

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

export const UserTable = pgTable("users", {
	id: text('id').primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: userRole().default('org:student').notNull(),
	profileImageUrl: text("profile_image_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const usersRelations = relations(UserTable, ({ many }) => ({
	exams: many(ExamTable),
	questions: many(QuestionTable),
	examAttempts: many(ExamAttemptTable),
	practiceSets: many(PracticeSetTable),
	practiceAttempts: many(PracticeAttemptTable),
	questionReviews: many(QuestionReviewTable),
	learningProgresses: many(LearningProgressTable),
}));

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

export const QuestionTable = pgTable("questions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	subjectId: uuid("subject_id").notNull(),
	createdBy: text("created_by").notNull(),
	questionText: text("question_text").notNull(),
	explanation: text(),
	options: jsonb().notNull(),
	correctAnswer: integer("correct_answer").notNull(),
	difficulty: difficultyLevel().default('medium').notNull(),
	status: questionStatus().default('draft').notNull(),
	tags: text().array().default([""]).notNull(),
	metadata: jsonb().default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_questions_created_by").using("btree", table.createdBy.asc().nullsLast().op("text_ops")),
	index("idx_questions_difficulty").using("btree", table.difficulty.asc().nullsLast().op("enum_ops")),
	index("idx_questions_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_questions_subject").using("btree", table.subjectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
		columns: [table.createdBy],
		foreignColumns: [UserTable.id],
		name: "questions_created_by_fkey"
	}),
	foreignKey({
		columns: [table.subjectId],
		foreignColumns: [SubjectTable.id],
		name: "questions_subject_id_fkey"
	}),
	check("valid_correct_answer", sql`(correct_answer >= 0) AND (correct_answer < jsonb_array_length(options))`),
]);

export const questionsRelations = relations(QuestionTable, ({ one, many }) => ({
	user: one(UserTable, {
		fields: [QuestionTable.createdBy],
		references: [UserTable.id]
	}),
	subject: one(SubjectTable, {
		fields: [QuestionTable.subjectId],
		references: [SubjectTable.id]
	}),
	questionReviews: many(QuestionReviewTable),
	practiceQuestions: many(PracticeQuestionTable),
	examQuestions: many(ExamQuestionTable),
}));

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

export const QuestionReviewTable = pgTable("question_reviews", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	questionId: uuid("question_id").notNull(),
	reviewedBy: text("reviewed_by").notNull(),
	status: varchar({ length: 20 }).notNull(),
	feedback: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [QuestionTable.id],
		name: "question_reviews_question_id_fkey"
	}),
	foreignKey({
		columns: [table.reviewedBy],
		foreignColumns: [UserTable.id],
		name: "question_reviews_reviewed_by_fkey"
	}),
]);

export const questionReviewsRelations = relations(QuestionReviewTable, ({ one }) => ({
	question: one(QuestionTable, {
		fields: [QuestionReviewTable.questionId],
		references: [QuestionTable.id]
	}),
	user: one(UserTable, {
		fields: [QuestionReviewTable.reviewedBy],
		references: [UserTable.id]
	}),
}));

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

export const ExamQuestionTable = pgTable("exam_questions", {
	examId: uuid("exam_id").notNull(),
	questionId: uuid("question_id").notNull(),
	questionOrder: integer("question_order").notNull(),
	points: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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

export const LearningProgressTable = pgTable("learning_progress", {
	userId: text("user_id").notNull(),
	subjectId: uuid("subject_id").notNull(),
	topic: text().notNull(),
	masteryLevel: integer("mastery_level").default(0).notNull(),
	practiceCount: integer("practice_count").default(0).notNull(),
	successRate: doublePrecision("success_rate").default(0).notNull(),
	lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_learning_progress_mastery").using("btree", table.masteryLevel.asc().nullsLast().op("int4_ops")),
	index("idx_learning_progress_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.subjectId],
		foreignColumns: [SubjectTable.id],
		name: "learning_progress_subject_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [UserTable.id],
		name: "learning_progress_user_id_fkey"
	}),
	primaryKey({ columns: [table.userId, table.subjectId, table.topic], name: "learning_progress_pkey" }),
	check("learning_progress_mastery_level_check", sql`(mastery_level >= 0) AND (mastery_level <= 100)`),
	check("learning_progress_success_rate_check", sql`(success_rate >= (0)::double precision) AND (success_rate <= (100)::double precision)`),
]);

export const learningProgressRelations = relations(LearningProgressTable, ({ one }) => ({
	subject: one(SubjectTable, {
		fields: [LearningProgressTable.subjectId],
		references: [SubjectTable.id]
	}),
	user: one(UserTable, {
		fields: [LearningProgressTable.userId],
		references: [UserTable.id]
	}),
}));