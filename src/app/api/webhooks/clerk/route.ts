import { env } from "@/data/env/server";
import { createUser } from "@/features/users/actions/users";
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
            console.log('User created', event.data)
            const user = await createUser({
                id: event.data.id,
                email: event.data.email_addresses[0].email_address,
                fullName: event.data.first_name + " " + event.data.last_name,
                role: event.data.organization_memberships?.[0]?.role as 'org:student' | 'org:teacher' | 'org:admin' ?? 'org:student',
                profileImageUrl: event.data.image_url,
            })

            console.log("User created", user)
    }

    return new Response('Webhook received', { status: 200 })
}