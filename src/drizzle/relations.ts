import { relations } from "drizzle-orm/relations";
import { UserTable, ExamTable, SubjectTable, QuestionTable, ExamAttemptTable, PracticeSetTable, PracticeAttemptTable, QuestionReviewTable, PracticeQuestionTable, ExamQuestionTable, LearningProgressTable } from "./schema";

export const examsRelations = relations(ExamTable, ({one, many}) => ({
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

export const usersRelations = relations(UserTable, ({many}) => ({
	exams: many(ExamTable),
	questions: many(QuestionTable),
	examAttempts: many(ExamAttemptTable),
	practiceSets: many(PracticeSetTable),
	practiceAttempts: many(PracticeAttemptTable),
	questionReviews: many(QuestionReviewTable),
	learningProgresses: many(LearningProgressTable),
}));

export const subjectsRelations = relations(SubjectTable, ({many}) => ({
	exams: many(ExamTable),
	questions: many(QuestionTable),
	practiceSets: many(PracticeSetTable),
	learningProgresses: many(LearningProgressTable),
}));

export const questionsRelations = relations(QuestionTable, ({one, many}) => ({
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

export const examAttemptsRelations = relations(ExamAttemptTable, ({one}) => ({
	exam: one(ExamTable, {
		fields: [ExamAttemptTable.examId],
		references: [ExamTable.id]
	}),
	user: one(UserTable, {
		fields: [ExamAttemptTable.userId],
		references: [UserTable.id]
	}),
}));

export const practiceSetsRelations = relations(PracticeSetTable, ({one, many}) => ({
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

export const practiceAttemptsRelations = relations(PracticeAttemptTable, ({one}) => ({
	user: one(UserTable, {
		fields: [PracticeAttemptTable.userId],
		references: [UserTable.id]
	}),
	practiceSet: one(PracticeSetTable, {
		fields: [PracticeAttemptTable.practiceSetId],
		references: [PracticeSetTable.id]
	}),
}));

export const questionReviewsRelations = relations(QuestionReviewTable, ({one}) => ({
	question: one(QuestionTable, {
		fields: [QuestionReviewTable.questionId],
		references: [QuestionTable.id]
	}),
	user: one(UserTable, {
		fields: [QuestionReviewTable.reviewedBy],
		references: [UserTable.id]
	}),
}));

export const practiceQuestionsRelations = relations(PracticeQuestionTable, ({one}) => ({
	practiceSet: one(PracticeSetTable, {
		fields: [PracticeQuestionTable.practiceSetId],
		references: [PracticeSetTable.id]
	}),
	question: one(QuestionTable, {
		fields: [PracticeQuestionTable.questionId],
		references: [QuestionTable.id]
	}),
}));

export const examQuestionsRelations = relations(ExamQuestionTable, ({one}) => ({
	exam: one(ExamTable, {
		fields: [ExamQuestionTable.examId],
		references: [ExamTable.id]
	}),
	question: one(QuestionTable, {
		fields: [ExamQuestionTable.questionId],
		references: [QuestionTable.id]
	}),
}));

export const learningProgressRelations = relations(LearningProgressTable, ({one}) => ({
	subject: one(SubjectTable, {
		fields: [LearningProgressTable.subjectId],
		references: [SubjectTable.id]
	}),
	user: one(UserTable, {
		fields: [LearningProgressTable.userId],
		references: [UserTable.id]
	}),
}));