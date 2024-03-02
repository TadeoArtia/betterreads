import {TRPCError} from "@trpc/server";
import {sha256} from "js-sha256";
import {z} from "zod";
import {env} from "~/env";


import {createTRPCRouter, protectedProcedure, publicProcedure,} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
		create: publicProcedure
		.input(z.object({email: z.string(), password: z.string(), username: z.string()}))
		.mutation(async ({ctx, input}) => {
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
			} catch (err) {
				console.log(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error creating user",
				});
			}
		}),
		updateProfileImage: protectedProcedure
		.input(z.object({image: z.string()}))
		.mutation(async ({ctx, input}) => {
			try {
				await ctx.db.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						image: input.image
					}
				});
			} catch (err) {
				console.log(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error updating image",
				});
			}
		}),
		getUserProfile: publicProcedure
		.input(z.object({id: z.string()}))
		.query(async ({ctx, input}) => {
			let ret;
			try {
				ret = await ctx.db.user.findUnique({
					where: {
						id: input.id
					}
				});
			} catch (err) {
				console.log(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error updating image",
				});
			}
			if (!ret) throw new TRPCError({
				code: "BAD_REQUEST",
				message: "User not found",
			});
			return {
				id: ret.id,
				name: ret.name,
				image: ret.image,
				email: ret.email,
				followers: ret.followers,
				following: ret.following,
				posts: ret.posts
			}
		}),
	}
)
