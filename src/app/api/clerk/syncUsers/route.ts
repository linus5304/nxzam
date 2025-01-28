import { createUser } from "@/features/users/actions/users";
import { insertUser } from "@/features/users/db/users";
import { getCurrentUser, syncClerkUserMetadata } from "@/services/clerk";
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
    const user = await currentUser();
    if (user == null) return new Response("User not found", { status: 500 });
    if (user.fullName == null) return new Response("User name not found", { status: 500 });
    if (user.primaryEmailAddress?.emailAddress == null) return new Response("User email not found", { status: 500 });

    const dbUser = await insertUser({
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName,
        role: user.publicMetadata.role as "user" | "admin",
        imageUrl: user.imageUrl,
        clerkUserId: user.id,
    });

    await syncClerkUserMetadata(dbUser);
    const clerkUser = await getCurrentUser({ allData: true })
}