import {Book} from "@prisma/client";
import {useEffect} from "react";
import Image from "next/legacy/image";

export default function ReviewCard({book, review}: { book: Book & {key: string}, review: any }) {

	useEffect(() => {
		console.log('review', review);
		console.log(review?.user?.image);
	}, []);


	return (
		<div className={`flex justify-between gap-2 bg-grey-variation p-5 rounded-md`}>
			<div className='flex gap-5 items-center '>
				{review?.user?.image ?
					<div className='w-10 h-10 relative'>
					<Image src={review.user.image} layout='fill'
						   objectFit='cover' alt="Image" className='rounded-full'/>
					</div>:
					<div className='w-10 h-10 rounded-full bg-primary flex justify-center align-middle'>
						<p className='text-lg m-auto text-white'>{review.user.name[0]}</p>
					</div>
				}
				<div>
					<p className='text-primary font-medium'>{review.user.name}</p>
					<p className='text-primary font-thin'>{review.review}</p>
				</div>
			</div>

			<p className='text-primary font-thin'>{review.rating}/5</p>
		</div>
	);

}
