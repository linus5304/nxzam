import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    imageUrl: z.string().optional(),
    role: z.enum(['user', 'admin']),
})

export type User = z.infer<typeof userSchema>