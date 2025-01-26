import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    profileImageUrl: z.string().optional(),
    role: z.enum(['org:student', 'org:teacher', 'org:admin']),
})

export type User = z.infer<typeof userSchema>