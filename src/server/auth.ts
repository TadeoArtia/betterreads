import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env";
import { db } from "~/server/db";
import { sha256 } from 'js-sha256';


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user }) => {
      const bookshelves = await db.bookshelf.findMany({ where: { userId: user.id } });
      if (bookshelves.length > 0) {
        return true;
      }
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
      return true;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        },
      }
    },
    async jwt({ user, token }) {
      //   update token from user
      if (user) {
        token.user = user;
      }
      //   return final_token
      return token;
    },
  },

  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: "",
      clientSecret: "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) return null;
        const user = await db.user.findFirst({
          where: { name: credentials.username },
        });
        const hash = sha256.create();
        hash.update(credentials.password + env.SALT);
        const hex = hash.hex();
        if (user && hex === user.password) {
          const { password, ...userdata } = user;
          return userdata;
        } else {
          console.log('error');
          return null;
        }
      },
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
