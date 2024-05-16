import {Book} from "@prisma/client";
import {Label} from "@radix-ui/react-label";
import {Separator} from "@radix-ui/react-menu";
import {useEffect, useState} from "react";
import {Button} from "~/components/shadcn/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/ui/dialog";
import {Textarea} from "~/components/shadcn/ui/textarea";
import {api} from "~/utils/api";


export default function ReviewBookDialog({
											 setIsOpen, book, bookshelfId, userId, isOpen
										 }: {
	setIsOpen: () => void;
	book: Book,
	bookshelfId: string, userId: string;
	isOpen: boolean
}) {

	const [choseRating, setChoseRating] = useState(0);
	const [review, setReview] = useState("");

	const removeBookMutation = api.bookshelves.removeBookFromBookshelf.useMutation();
	const addBookMutation = api.bookshelves.addBookToBookshelf.useMutation();
	const addReviewMutation = api.bookshelves.addReview.useMutation();

	const onCreateReview = async () => {
		await addReviewMutation.mutateAsync({
			bookId: book.id,
			rating: choseRating,
			review: review
		})
		await onMoveBook();
		setIsOpen();
	}


	const onMoveBook = async () => {
		await removeBookMutation.mutateAsync({
			bookshelfId,
			bookId: book.id,
		})
		await addBookMutation.mutateAsync({
			bookshelfId: `read-${userId}`,
			bookId: book.id
		})
	}

	useEffect(() => {
		setChoseRating(0);
		setReview("");
		console.log("ESTE ES EL LIBRO", book.id)
	}, [isOpen]);


	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Review a book</DialogTitle>
				<DialogDescription>
					What do you think about <span className="font-medium">{book.title}</span>?
				</DialogDescription>
			</DialogHeader>
			<Label>Rating</Label>
			<DialogDescription className={'gap-2 flex'}>
				<Button variant={choseRating == 1 ? 'default' : "outline"} onClick={() => setChoseRating(1)}>1</Button>
				<Button variant={choseRating == 2 ? 'default' : "outline"} onClick={() => setChoseRating(2)}>2</Button>
				<Button variant={choseRating == 3 ? 'default' : "outline"} onClick={() => setChoseRating(3)}>3</Button>
				<Button variant={choseRating == 4 ? 'default' : "outline"} onClick={() => setChoseRating(4)}>4</Button>
				<Button variant={choseRating == 5 ? 'default' : "outline"} onClick={() => setChoseRating(5)}>5</Button>
			</DialogDescription>
			<Separator/>
			<Label htmlFor="message">Your message</Label>
			<Textarea placeholder="Type your review here (optional)." id="message" onResize={() => null}
					  className={'max-h-56'} onChange={(event) =>
				setReview(event.target.value)}/>
			<DialogFooter>
				<Button disabled={choseRating == 0} onClick={() => onCreateReview()}>Confirm</Button>
			</DialogFooter>
		</DialogContent>
	);
}
