import { env } from "@/data/env/server";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";


export async function POST(req: Request) {
    const headerPayload = await headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing svix headers', { status: 400 })
    }

    console.log("Webhook received", svixId, svixTimestamp, svixSignature)

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent
    } catch (error) {
        console.error("Error verifying webhook", error)
        return new Response('Error verifying webhook', { status: 400 })
    }

    switch (event.type) {
        case 'user.created':
        case 'user.updated': {
            console.log("User created", event.data)
            const email = event.data.email_addresses.find(email => email.id === event.data.primary_email_address_id)?.email_address
            const fullName = `${event.data.first_name} ${event.data.last_name}`
            if (email == null) return new Response("No email", { status: 400 });
            if (fullName == "") return new Response("No full name", { status: 400 });

            if (event.type == "user.created") {
                const user = await insertUser({
                    clerkUserId: event.data.id,
                    email: email,
                    fullName: fullName,
                    role: "admin",
                    imageUrl: event.data.image_url,
                })

                await syncClerkUserMetadata(user);
            } else {
                await updateUser(
                    { clerkUserId: event.data.id },
                    {
                        email,
                        fullName,
                        role: event.data.public_metadata.role as "user" | "admin",
                        imageUrl: event.data.image_url,
                    });
            }
            break;
        }
        case 'user.deleted': {
            if (event.data.id != null) {
                await deleteUser({ clerkUserId: event.data.id });
            }
            break;
        }
    }

    return new Response('Webhook received', { status: 200 })
}