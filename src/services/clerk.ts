import { db } from "@/drizzle/db";
import { UserRole, UserTable } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const client = await clerkClient()

export async function getCurrentUser({ allData = false } = {}) {
    const { userId, sessionClaims, redirectToSignIn } = await auth()

    if (userId != null && sessionClaims.dbId == null) {
        redirect("/api/clerk/syncUsers")
    }

    return {
        clerkUserId: userId,
        userId: sessionClaims?.dbId as string,
        role: sessionClaims?.role as UserRole,
        user:
            allData && sessionClaims?.dbId != null ? await getUser(sessionClaims.dbId as string) : undefined,
        redirectToSignIn,
    }
}

export function syncClerkUserMetadata(user: {
    id: string,
    clerkUserId: string,
    role: string,
}) {
    return client.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
            dbId: user.id,
            role: user.role,
        }
    })
}

export async function getUser(id: string) {
    "use cache"
    return db.query.UserTable.findFirst({
        where: eq(UserTable.id, id)
    })
}