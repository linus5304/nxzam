"use server"

import { User, userSchema } from "@/features/users/schemas/users"
import { insertUser } from "@/features/users/db/users"

export async function createUser(data: User) {
    const { success, data: userData, error } = userSchema.safeParse(data)

    if (!success) {
        return { error: true, message: `Error occured while creating user ${error}` }
    }

    // TODO: Review this section for clerkUserId
    const user = await insertUser({
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        clerkUserId: "",
        role: userData.role,
        imageUrl: userData.imageUrl,
    })

    return user
}