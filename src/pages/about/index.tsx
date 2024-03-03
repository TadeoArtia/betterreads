import Image from "next/image";
import {AspectRatio} from "~/components/shadcn/ui/aspect-ratio";
import Layout from "~/components/utils/Layout";

export default function About() {
	return (
		<Layout>
			<div className="flex flex-col items-center justify-center h-full bg-light-grey gap-24 px-60">
				<div className='flex justify-between gap-40 w-full'>
					<div className="w-1/3 h-full align-middle justify-center items-center">
						<AspectRatio ratio={1}>
							<Image src="/oldbooks.webp" layout='fill'
								   objectFit='cover' alt="Image" className="rounded-md object-cover"/>
						</AspectRatio>
					</div>
					<div className='w-1/2 flex flex-col justify-center align-middle h-full'>
						<h1 className="text-4xl font-bold text-center text-primary">About Us</h1>
						<p className="text-lg mt-4 text-primary">
							BetterReads is an app by readers for readers. Our aim is to help everyone achieve the most
							out of their readig. Wheather you are looking for a heart-breaking romance or the next big
							thriller, we have got you covered. Our team of experts have curated a list of books that
							will help you find your next favorite book. We are constantly updating our database to make
							sure you get the best recommendations. We also have a community of readers who share their
							thoughts and reviews on the books they have read. We hope you enjoy your time here. Happy
							Reading!
						</p>
					</div>
				</div>
				{/*	Join us*/}
				<div className="flex flex-col w-full bg-grey p-10 rounded-md">
					<h1 className="text-2xl font-bold text-primary">Want to join the team?</h1>
					<p className="text-lg mt-4 text-primary">
						We are always looking for passionate readers to join our team. If you are interested in
						contributing to our database, please send us an email at <a href="mailto:tlartia00@gmail.com"
																					className="text-primary underline">
					</a>
					</p>
				</div>
			</div>
		</Layout>
	);
}
