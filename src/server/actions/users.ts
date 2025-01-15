"use server"

import { User, userSchema } from "@/schemas/users"
import { createUserDB } from "@/server/db/users"
import { error } from "console"

export async function createUser(data: User) {
    const { success, data: userData, error } = userSchema.safeParse(data)

    if (!success) {
        return { error: true, message: `Error occured while creating user ${error}` }
    }

    const user = await createUserDB({
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        passwordHash: "",
        role: userData.role,
        profileImageUrl: userData.profileImageUrl,
    })

    return user
}