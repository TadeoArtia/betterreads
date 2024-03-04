import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import axios from "axios";
import { db } from "~/server/db";
import { z } from "zod";
import { isSystemBookshelf } from "~/lib/utils";


export const bookshelfRouter = createTRPCRouter({
    //   hello: publicProcedure
    //     .input(z.object({ text: z.string() }))
    //     .query(({ input }) => {
    //       return {
    //       };
    //     }),

    create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await db.bookshelf.create({
                data: {
                    name: input.name,
                    userId: ctx.session.user.id,
                },
            });
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const bookshelf = await db.bookshelf.findUnique({ where: { id: input.id } });
            if (!bookshelf) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Bookshelf not found" });
            }
            if (isSystemBookshelf(input.id)) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You cannot edit system bookshelves" });
            }
            if (bookshelf.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to delete this bookshelf" });
            }
            await db.bookshelf.delete({ where: { id: input.id } });
        }),
    edit: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const bookshelf = await db.bookshelf.findUnique({ where: { id: input.id } });
            if (!bookshelf) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Bookshelf not found" });
            }
            if (isSystemBookshelf(input.id)) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You cannot edit system bookshelves" });
            }
            if (bookshelf.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to edit this bookshelf" });
            }
            await db.bookshelf.update({ where: { id: input.id }, data: { name: input.name } });
        }),
    userBookshelves: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return db.bookshelf.findMany({ where: { userId: input.userId }, include: { _count: { select: { books: true } } } });
        }),
    addBookToBookshelf: protectedProcedure
        .input(z.object({ bookId: z.string(), bookshelfId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const bookshelf = await db.bookshelf.findUnique({ where: { id: input.bookshelfId } });
            if (!bookshelf) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Bookshelf not found" });
            }
            if (bookshelf.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to add books to this bookshelf" });
            }
            await addBookIfNeeded(input.bookId);
            await db.bookshelf.update({
                where: { id: input.bookshelfId },
                data: {
                    books: {
                        connect: { id: input.bookId },
                    },
                },
            });
        }),
    removeBookFromBookshelf: protectedProcedure
        .input(z.object({ bookId: z.string(), bookshelfId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const bookshelf = await db.bookshelf.findUnique({ where: { id: input.bookshelfId } });
            if (!bookshelf) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Bookshelf not found" });
            }
            if (bookshelf.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to remove books from this bookshelf" });
            }
            await db.bookshelf.update({
                where: { id: input.bookshelfId },
                data: {
                    books: {
                        disconnect: { id: input.bookId },
                    },
                },
            });
        }),
});

const addBookIfNeeded = async (bookId: string) => {
    const book = await db.book.findUnique({ where: { id: bookId } });
    if (!book) {
        let bookInformation = await axios.get(`https://openlibrary.org/works/${bookId}.json`)
        if (!bookInformation.data.title) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Title not found, please try another version of the book" });
        }
        if (bookInformation.data.authors.length == 0) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Author not found, please try another version of the book" });
        } else {
            for (let author of bookInformation.data.authors) {
                let authorInformation = await axios.get(`https://openlibrary.org${author.author.key}.json`)
                await db.author.create({
                    data: {
                        id: author.author.key,
                        name: authorInformation.data.name,
                    }
                })
            }
        }
        await db.book.create({
            data: {
                id: bookId,
                title: bookInformation.data.title,
                authors: {
                    connect: bookInformation.data.authors.map((author: any) => {
                        return { id: author.author.key }
                    })
                }
            }
        })
    }
}

