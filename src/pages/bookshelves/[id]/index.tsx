import Layout from "~/components/utils/Layout";
import SuperJSON from "superjson";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "~/server/db";
import { useParams } from "next/navigation";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { isSystemBookshelf } from "~/lib/utils";
import { Separator } from "~/components/shadcn/ui/separator";
import { Button } from "~/components/shadcn/ui/button";
import { Dialog, DialogTrigger } from "~/components/shadcn/ui/dialog";
import CreateShelfDialog from "./CreateShelfDialog";
import { useEffect, useState } from "react";
import ListBookshelves from "../ListBookshelves";

export default function Bookshelves() {
  const userId = useParams().id as string;
  return (
    <Layout>
      <main className="flex  w-full flex-1 justify-between bg-grey-variation px-20 py-4">
        <ListBookshelves userId={userId} />
        <section className="grow">
          <h1></h1>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db: db, session: null },
    transformer: SuperJSON,
  });

  await helpers.bookshelves.userBookshelves.prefetch({
    userId: ctx.params?.id as string,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      invalidate: 1,
    },
  };
};
