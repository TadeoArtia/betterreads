import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { sha256 } from "js-sha256";
import { z } from "zod";

export const userRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ email: z.string(), password: z.string(), username: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = await ctx.db.user.findUnique({
                    where: {
                        email: input.email
                    }
                });
                if (user) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "User already exists",
                    });
                }
                const hash = sha256.create();
                hash.update(input.password + env.SALT);
                const hex = hash.hex();
                const response = await ctx.db.user.create({
                    data: {
                        email: input.email,
                        name: input.username,
                        password: hex,
                    }
                });
                return {
                    id: response.id,
                    email: response.email
                }
            }
            catch (err) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error creating user",
                });
            }
        }),
})