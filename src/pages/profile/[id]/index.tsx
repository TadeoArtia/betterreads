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
import { useSession } from "next-auth/react";

const cards = [1, 2, 3, 4]

export default function Profile() {
	const params = useParams<{ id: string }>();
	const { data: userProfile, isLoading, refetch } = api.user.getUserProfile.useQuery({ id: params.id });


	return (
		<Layout>
			<main className="m-0 flex h-screen w-screen items-center justify-start bg-grey flex-col relative">
				<Banner userProfile={userProfile} refetch={refetch} />
				<div className='w-full bg-grey h-1/6 flex justify-between px-20 gap-5 pt-3 pr-60'>
					<InfoSection userProfile={userProfile} refetch={refetch} />
				</div>
				<div className='w-full bg-grey-variation bg-blend-color flex flex-grow py-10 px-40 gap-5 flex-col'>
					{cards.map((card) => <Card key={card} data={card} />)}
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
}
