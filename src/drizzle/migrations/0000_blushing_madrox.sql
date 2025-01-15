CREATE TYPE "public"."difficulty_level" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."exam_type" AS ENUM('gce_ol', 'gce_al');--> statement-breakpoint
CREATE TYPE "public"."practice_type" AS ENUM('self_study', 'guided', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('org:student', 'org:teacher', 'org:admin');--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"score" integer,
	"answers" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_attempts_score_check" CHECK (score >= 0),
	CONSTRAINT "valid_completion" CHECK ((completed_at IS NULL) OR (completed_at > started_at))
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"exam_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"question_order" integer NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_questions_pkey" PRIMARY KEY("exam_id","question_id"),
	CONSTRAINT "exam_questions_points_check" CHECK (points > 0),
	CONSTRAINT "exam_questions_question_order_check" CHECK (question_order > 0)
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"subject_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"passing_score" integer NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exams_duration_minutes_check" CHECK (duration_minutes > 0),
	CONSTRAINT "exams_passing_score_check" CHECK (passing_score >= 0)
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"user_id" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"topic" text NOT NULL,
	"mastery_level" integer DEFAULT 0 NOT NULL,
	"practice_count" integer DEFAULT 0 NOT NULL,
	"success_rate" double precision DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "learning_progress_pkey" PRIMARY KEY("user_id","subject_id","topic"),
	CONSTRAINT "learning_progress_mastery_level_check" CHECK ((mastery_level >= 0) AND (mastery_level <= 100)),
	CONSTRAINT "learning_progress_success_rate_check" CHECK ((success_rate >= (0)::double precision) AND (success_rate <= (100)::double precision))
);
--> statement-breakpoint
CREATE TABLE "practice_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_set_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"score" integer,
	"answers" jsonb,
	"feedback" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_attempts_score_check" CHECK (score >= 0),
	CONSTRAINT "valid_completion" CHECK ((completed_at IS NULL) OR (completed_at > started_at))
);
--> statement-breakpoint
CREATE TABLE "practice_questions" (
	"practice_set_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"question_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_questions_pkey" PRIMARY KEY("practice_set_id","question_id"),
	CONSTRAINT "practice_questions_question_order_check" CHECK (question_order > 0)
);
--> statement-breakpoint
CREATE TABLE "practice_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"practice_type" "practice_type" DEFAULT 'self_study' NOT NULL,
	"subject_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"topics" text[] DEFAULT '{""}' NOT NULL,
	"duration_minutes" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_sets_duration_minutes_check" CHECK (duration_minutes > 0)
);
--> statement-breakpoint
CREATE TABLE "question_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"reviewed_by" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"question_text" text NOT NULL,
	"explanation" text,
	"options" jsonb NOT NULL,
	"correct_answer" integer NOT NULL,
	"difficulty" "difficulty_level" DEFAULT 'medium' NOT NULL,
	"status" "question_status" DEFAULT 'draft' NOT NULL,
	"tags" text[] DEFAULT '{""}' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "valid_correct_answer" CHECK ((correct_answer >= 0) AND (correct_answer < jsonb_array_length(options)))
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20) NOT NULL,
	"exam_type" "exam_type" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_name_code_key" UNIQUE("name","code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'org:student' NOT NULL,
	"profile_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_practice_set_id_fkey" FOREIGN KEY ("practice_set_id") REFERENCES "public"."practice_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_practice_set_id_fkey" FOREIGN KEY ("practice_set_id") REFERENCES "public"."practice_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_questions" ADD CONSTRAINT "practice_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_sets" ADD CONSTRAINT "practice_sets_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_sets" ADD CONSTRAINT "practice_sets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_reviews" ADD CONSTRAINT "question_reviews_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_reviews" ADD CONSTRAINT "question_reviews_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_exam" ON "exam_attempts" USING btree ("exam_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_user" ON "exam_attempts" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_exams_created_by" ON "exams" USING btree ("created_by" text_ops);--> statement-breakpoint
CREATE INDEX "idx_exams_subject" ON "exams" USING btree ("subject_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_learning_progress_mastery" ON "learning_progress" USING btree ("mastery_level" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_learning_progress_user" ON "learning_progress" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_questions_created_by" ON "questions" USING btree ("created_by" text_ops);--> statement-breakpoint
CREATE INDEX "idx_questions_difficulty" ON "questions" USING btree ("difficulty" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_questions_status" ON "questions" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_questions_subject" ON "questions" USING btree ("subject_id" uuid_ops);