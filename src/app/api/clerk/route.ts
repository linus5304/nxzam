import { env } from "@/data/env/server";
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

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            id: svixId,
            timestamp: svixTimestamp,
            signature: svixSignature,
        }) as WebhookEvent
    } catch (error) {
        console.error("Error verifying webhook", error)
        return new Response('Error verifying webhook', { status: 400 })
    }

    switch (event.type) {
        case 'user.created':
            console.log('User created', event.data)
            break
    }

    return new Response('Webhook received', { status: 200 })
}