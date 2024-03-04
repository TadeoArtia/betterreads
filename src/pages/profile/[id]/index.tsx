import Banner from "~/pages/profile/banner";
import Card from "~/pages/profile/cards";
import { GetServerSidePropsContext } from "next/types";
import InfoSection from "~/pages/profile/infoSection";
import Layout from "~/components/utils/Layout";
import SuperJSON from "superjson";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "~/server/db";
import { useParams } from "next/navigation";

const cards = [1, 2, 3, 4];

export default function Profile() {
  const params = useParams<{ id: string }>();
  const {
    data: userProfile,
    isLoading,
    refetch,
  } = api.user.getUserProfile.useQuery({ id: params.id });

  return (
    <Layout>
      <main className="relative m-0 flex h-screen w-screen flex-col items-center justify-start bg-grey">
        <Banner userProfile={userProfile} refetch={refetch} />
        <div className="flex h-1/6 w-full justify-between gap-5 bg-grey px-20 pr-60 pt-3">
          <InfoSection userProfile={userProfile} refetch={refetch} />
        </div>
        <div className="flex w-full flex-grow flex-col gap-5 bg-grey-variation px-40 py-10 bg-blend-color">
          {cards.map((card) => (
            <Card key={card} data={card} />
          ))}
        </div>
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

  await helpers.user.getUserProfile.prefetch({ id: ctx.params?.id as string });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      invalidate: 1,
    },
  };
};
