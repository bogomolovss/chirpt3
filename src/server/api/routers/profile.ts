import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { userAgent } from "next/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";



export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(z.object({ username: z.string() })).
        query(async ({ input }) => {
            const [user] = await clerkClient.users.getUserList({
                username: [input.username],
            });

            if (!user) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User not found",
                })
            }

            return filterUserForClient(user);
        }),
});
