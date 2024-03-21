import Layout from "~/components/utils/Layout";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "~/server/db";
import { useParams } from "next/navigation";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { api } from "~/utils/api";
import ListBookshelves from "~/components/bookshelves/ListBookshelves";
import BookShelfDetails from "~/components/bookshelves/BookshelfDeatils";

export default function Bookshelves() {
  const userId = useParams().id as string;
  const [selectedBookshelfId, setSelectedBookshelfId] = useState<string>(
    `want-to-read-${userId}`,
  );

  return (
    <Layout>
      <main className="flex  w-full flex-1 justify-between bg-grey-variation px-20 py-4">
        <ListBookshelves
          userId={userId}
          selectedBookshelfId={selectedBookshelfId}
          setSelectedBookshelfId={setSelectedBookshelfId}
        />
        <section className="flex grow">
          <BookShelfDetails bookshelfId={selectedBookshelfId} />
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
