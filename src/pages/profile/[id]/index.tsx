import {createServerSideHelpers} from "@trpc/react-query/server";
import {useParams} from "next/navigation";
import {GetServerSidePropsContext} from "next/types";
import {useEffect, useState} from "react";
import SuperJSON from "superjson";
import Layout from "~/components/utils/Layout";
import Banner from "~/pages/profile/banner";
import Card from "~/pages/profile/cards";
import InfoSection from "~/pages/profile/infoSection";
import {appRouter} from "~/server/api/root";
import {db} from "~/server/db";
import {api} from "~/utils/api";

const cards = [1, 2, 3, 4];

export default function Profile() {
	const params = useParams<{ id: string }>();

	const {
		data: userProfile,
		isLoading,
		refetch: refetchInternal,
	} = api.user.getUserProfile.useQuery({id: params.id});

	async function refetch(){
		await refetchInternal();
		if(showFollowers){
			handleFollowersClick()
			handleFollowingClick()
		}
		else{
			handleFollowingClick()
			handleFollowersClick()
		}
	}

	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);

	const handleFollowersClick = () => {
		setShowFollowers(true);
		setShowFollowing(false); // Hide following list if it's currently shown
		// Additional logic to fetch followers and update state if needed
	};

	const handleFollowingClick = () => {
		setShowFollowing(true);
		setShowFollowers(false); // Hide followers list if it's currently shown
		// Additional logic to fetch following and update state if needed
	};

	return (
		<Layout>
			<main
				className="relative m-0 flex min-h-fit flex-grow w-screen flex-col items-center justify-start bg-grey">
				<Banner userProfile={userProfile} refetch={refetch}/>
				<div className="flex h-1/6 max-h-32 w-full justify-between gap-5 bg-grey px-20 pr-60 pt-3">
					<InfoSection userProfile={userProfile} refetch={refetch} onFollowersClick={handleFollowersClick}
								 onFollowingClick={handleFollowingClick}/>
				</div>

				{showFollowers && (
					<>
						<div
							className="flex w-full flex-grow flex-col gap-5 bg-grey-variation px-40 py-10 bg-blend-color">
							<h1 className='text-4xl font-bold'>Followers</h1>
							<Card data={userProfile?.followers ?? []} followingList={false} owner={userProfile} refetch={refetch}/>
						</div>
					</>
				)}

				{showFollowing && (
					<>
						<div
							className="flex w-full flex-grow flex-col gap-5 bg-grey-variation px-40 py-10 bg-blend-color">
							<h1 className='text-4xl font-bold'>Following</h1>
							<Card data={userProfile?.following || []} followingList={true} owner={userProfile} refetch={refetch}/>
						</div>
					</>
				)}


			</main>
		</Layout>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const helpers = createServerSideHelpers({
		router: appRouter,
		ctx: {db: db, session: null},
		transformer: SuperJSON,
	});

	await helpers.user.getUserProfile.prefetch({id: ctx.params?.id as string});

	return {
		props: {
			trpcState: helpers.dehydrate(),
			invalidate: 1,
		},
	};
};
