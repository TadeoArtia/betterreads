import {useSession} from "next-auth/react";
import Image from "next/legacy/image";
import Layout from "~/components/utils/Layout";
import Card from "~/pages/profile/cards";
import InfoSection from "~/pages/profile/infoSection";

const cards = [1, 2, 3, 4]

export default function Profile() {
	const session = useSession();

	return (
		<Layout session={session.data}>
			<main className="m-0 flex h-screen w-screen items-center justify-start bg-grey flex-col relative">
				<div className='w-full bg-white h-1/4 relative'>
					<Image src="/books.jpeg" alt="Image"
						   layout='fill'
						   objectFit='cover'/>
				</div>
				<div className='w-full bg-grey h-1/6 flex justify-between px-20 gap-5 pt-3 pr-60'>
					<InfoSection/>
				</div>
				<div className='w-full bg-grey-variation bg-blend-color flex flex-grow py-10 px-40 gap-5 flex-col'>
					{cards.map((card) => <Card key={card} data={card}/>)}
				</div>
			</main>
		</Layout>
	);
}
