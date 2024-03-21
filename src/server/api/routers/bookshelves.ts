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
  getBookshelf: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const bookshelf = await db.bookshelf.findUnique({
        where: { id: input.id },
        include: {
          books: {
            include: { authors: true },
          },
        },
      });
      if (!bookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookshelf not found",
        });
      }
      return bookshelf;
    }),
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
      const bookshelf = await db.bookshelf.findUnique({
        where: { id: input.id },
      });
      if (!bookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookshelf not found",
        });
      }
      if (isSystemBookshelf(input.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot edit system bookshelves",
        });
      }
      if (bookshelf.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this bookshelf",
        });
      }
      await db.bookshelf.delete({ where: { id: input.id } });
    }),
  edit: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const bookshelf = await db.bookshelf.findUnique({
        where: { id: input.id },
      });
      if (!bookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookshelf not found",
        });
      }
      if (isSystemBookshelf(input.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot edit system bookshelves",
        });
      }
      if (bookshelf.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to edit this bookshelf",
        });
      }
      await db.bookshelf.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  userBookshelves: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const bookshelves = await db.bookshelf.findMany({
        where: { userId: user.id },
      });
      if (bookshelves.length === 0) {
        await db.bookshelf.create({
          data: {
            id: `want-to-read-${user.id}`,
            name: "Want to read",
            userId: user.id,
          },
        });
        await db.bookshelf.create({
          data: {
            id: `currently-reading-${user.id}`,
            name: "Currently reading",
            userId: user.id,
          },
        });
        await db.bookshelf.create({
          data: {
            id: `read-${user.id}`,
            name: "Read",
            userId: user.id,
          },
        });
      }
      return db.bookshelf.findMany({
        where: { userId: input.userId },
        include: { _count: { select: { books: true } } },
      });
    }),
  addBookToBookshelf: protectedProcedure
    .input(z.object({ bookId: z.string(), bookshelfId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookshelf = await db.bookshelf.findUnique({
        where: { id: input.bookshelfId },
      });
      console.log(bookshelf);
      if (!bookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookshelf not found",
        });
      }
      if (bookshelf.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to add books to this bookshelf",
        });
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
      const bookshelf = await db.bookshelf.findUnique({
        where: { id: input.bookshelfId },
      });
      if (!bookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookshelf not found",
        });
      }
      if (bookshelf.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to remove books from this bookshelf",
        });
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
  console.log("bookId", bookId);
  const book = await db.book.findUnique({ where: { id: bookId } });
  console.log(book);
  if (!book) {
    let bookInformation = await axios.get(
      `https://openlibrary.org/works/${bookId}.json`,
    );
    console.log(bookInformation.data);
    if (!bookInformation.data.title) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Title not found, please try another version of the book",
      });
    }
    if (bookInformation.data.authors.length == 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Author not found, please try another version of the book",
      });
    } else {
      for (let author of bookInformation.data.authors) {
        let authorInformation = await axios.get(
          `https://openlibrary.org${author.author.key}.json`,
        );
        await db.author.upsert({
          update: {
            name: authorInformation.data.name,
          },
          create: {
            id: author.author.key,
            name: authorInformation.data.name,
          },
          where: { id: author.author.key },
        });
      }
    }
    await db.book.create({
      data: {
        id: bookId,
        title: bookInformation.data.title,
        image: `https://covers.openlibrary.org/b/id/${bookInformation.data.covers[0]}-L.jpg`,
        authors: {
          connect: bookInformation.data.authors.map((author: any) => {
            return { id: author.author.key };
          }),
        },
      },
    });
  }
  console.log("bakoom");
};
