import {inferAsyncReturnType, TRPCError} from "@trpc/server";
import {sha256} from "js-sha256";
import {z} from "zod";
import {env} from "~/env";
import {createTRPCRouter, protectedProcedure, publicProcedure,} from "~/server/api/trpc";
import {db} from "~/server/db";

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
			let ret: inferAsyncReturnType<typeof getUserWithFollowers> | null = null
			try {
				ret = await getUserWithFollowers(input.id);
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
				imageBanner: ret.imageBanner,
				email: ret.email,
				posts: ret.posts,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
				followers: ret.followers.map(f => f.follower),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
				following: ret.following.map(f => f.following)
			}
		}),
		updateBannerImage: protectedProcedure
		.input(z.object({image: z.string()}))
		.mutation(async ({ctx, input}) => {
			try {
				await ctx.db.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						imageBanner: input.image
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
		addFollowingRelationship: protectedProcedure
		.input(z.object({id: z.string()}))
		.mutation(async ({ctx, input}) => {
			try {
				console.log("Adding following relationship", input.id, ctx.session.user.id);
				await ctx.db.userRelation.create({
					data: {
						following: {
							connect: {
								id: input.id
							}
						},
						follower: {
							connect: {
								id: ctx.session.user.id
							}
						}
					}
				});
			} catch (err) {
				console.log(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error following user",
				});
			}
		}),
		removeFollowingRelationship: protectedProcedure
		.input(z.object({followerId: z.string(), followingId: z.string()}))
		.mutation(async ({ctx, input}) => {
			try {
				await ctx.db.userRelation.deleteMany({
					where: {
						followingId: input.followingId,
						followerId: input.followerId
					}
				});
			} catch (err) {
				console.log(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error unfollowing user",
				});
			}
		}),
	}
)

async function getUserWithFollowers(id: string) {
	const user = await db.user.findUnique({
		where: {
			id: id
		},
		include: {
			following: {
				include: {
					following: true
				}
			},
			followers: {
				include: {
					follower: true
				}
			},
		}
	});
	return user;
}
