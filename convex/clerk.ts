"use node";

import type { WebhookEvent } from "@clerk/nextjs/server";
import { v } from "convex/values";
import { Webhook } from "svix";

import { internalAction } from "./_generated/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

// private no public access
// Action -> to interact with 3rd party
export const fulfill = internalAction({
    args: { headers: v.any(), payload: v.string() },
    handler: async (ctx, args) => {
        const wh = new Webhook(webhookSecret);
        const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
        return payload;
    },
});