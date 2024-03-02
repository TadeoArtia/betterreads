import Image from "next/legacy/image";
import Card from "~/pages/profile/cards";

const cards = [1, 2, 3, 4]

export default function Profile() {
	return (
		<main className="m-0 flex h-screen w-screen items-center justify-start bg-grey flex-col relative">
			<div className='w-full bg-white h-1/4 relative'>
				<Image src="/books.jpeg" alt="Image"
					   layout='fill'
					   objectFit='cover'/>
			</div>
			<div className='w-full bg-grey h-1/6 flex justify-between px-20 gap-5 pt-3 pr-60'>
				<div className='flex gap-5'>
					<div className="relative w-40 h-40 p-3 bg-dark-grey border-[12px] -top-20 -bottom-20 rounded-md">
						<div className="rounded-md overflow-hidden p-3">
							<Image src="/person.jpeg" alt="Image"
								   layout='fill'
								   objectFit='cover'/>
						</div>
					</div>

					<div>
						<h1 className='text-2xl font-bold'>Person name</h1>
						<p className='text-sm'>Username</p>
					</div>
				</div>

				<div className='flex justify-between gap-7 self-start pt-2'>
					<div>
						<p className='text-sm text-center font-semibold'>10</p>
						<h1 className='text-sm text-center'>Followers</h1>
					</div>
					<div>
						<p className='text-sm text-center font-semibold'>10</p>
						<h1 className='text-sm text-center'>Following</h1>
					</div>
					<div>
						<p className='text-sm text-center font-semibold'>10</p>
						<h1 className='text-sm text-center'>Posts</h1>
					</div>
				</div>


			</div>
			<div className='w-full bg-grey-variation bg-blend-color flex flex-grow py-10 px-40 gap-5 flex-col'>
				{cards.map((card) => <Card key={card} data={card}/>)}
			</div>
		</main>
	);
}
