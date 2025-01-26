import { sql, relations } from "drizzle-orm";
import { pgTable, text, uuid, integer, doublePrecision, timestamp, index, foreignKey, primaryKey, check } from "drizzle-orm/pg-core";
import { SubjectTable, UserTable } from "../schema";

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