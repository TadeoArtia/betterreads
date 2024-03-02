import {useSession} from "next-auth/react";
import Layout from "~/components/utils/Layout";
import Banner from "~/pages/profile/banner";
import Card from "~/pages/profile/cards";
import InfoSection from "~/pages/profile/infoSection";
import {api} from "~/utils/api";

const cards = [1, 2, 3, 4]

export default function Profile() {
	const session = useSession();

	const {data: userProfile, isLoading, refetch} = api.user.getUserProfile.useQuery({id: session.data?.user.id ?? ""});


	return (
		<Layout session={session.data}>
			<main className="m-0 flex h-screen w-screen items-center justify-start bg-grey flex-col relative">
				<Banner userProfile={userProfile} refetch={refetch}/>
				<div className='w-full bg-grey h-1/6 flex justify-between px-20 gap-5 pt-3 pr-60'>
					<InfoSection userProfile={userProfile} refetch={refetch}/>
				</div>
				<div className='w-full bg-grey-variation bg-blend-color flex flex-grow py-10 px-40 gap-5 flex-col'>
					{cards.map((card) => <Card key={card} data={card}/>)}
				</div>
			</main>
		</Layout>
	);
}
