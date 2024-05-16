import {Book} from "@prisma/client";
import {useEffect} from "react";
import ReviewCard from "~/pages/book/[id]/reviewCard";
import {api} from "~/utils/api";

export default function UserReviews({book}: { book: Book & { key: string } }) {

	const {data: userReviews, isLoading} =

		api.bookshelves.getReviews.useQuery({
			id: book.key.replace("/works/", ""),
		});

	useEffect(() => {
		console.log("Reviews", userReviews);
	}, [userReviews]);

	return (
		userReviews && (userReviews.length > 0) && (
        <div className='flex flex-col gap-5 bg-grey p-10'>
            <h1 className="text-3xl font-medium text-primary">Users' reviews</h1>
			{userReviews.map((review, index) =>
				<ReviewCard key={index} book={book} review={review}/>
			)}
        </div>
		)
	);
}
