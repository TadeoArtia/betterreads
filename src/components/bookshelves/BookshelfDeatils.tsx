import {type Book} from "@prisma/client";
import {useRef, useState} from "react";
import {ListBookshelvesRef} from "~/components/bookshelves/ListBookshelves";
import MoveShelfDialog from "~/components/bookshelves/MoveShelfDialog";
import {Button} from "~/components/shadcn/ui/button";
import {Dialog, DialogTrigger} from "~/components/shadcn/ui/dialog";
import {api} from "~/utils/api";

export default function BookShelfDetails({
											 bookshelfId, userId, refreshList
										 }: {
	bookshelfId: string;
	userId: string;
	refreshList: any
}) {
	const {data: bookshelfData, isLoading, refetch} =
		api.bookshelves.getBookshelf.useQuery({
			id: bookshelfId,
		});

	const removeBookMutation = api.bookshelves.removeBookFromBookshelf.useMutation();
	const [open, setOpen] = useState(false);

	if (isLoading || !bookshelfData) {
		return <p>Loading...</p>;
	}

	function refetchFull(){
		console.log("refetching")
		refreshList()
		refetch();
	}

	const onRemoveBook = async (book: Book) => {
		await removeBookMutation.mutateAsync({
			bookshelfId,
			bookId: book.id,
		})
		await refetch()
	}


	return (
		<div className="flex grow flex-col gap-4 rounded-sm bg-grey px-4 py-4">
			<h1 className="text-xl font-medium">{bookshelfData.name}</h1>
			{bookshelfData ? (
				<ul className="flex flex-col gap-2 w-full">
					{bookshelfData.books.map((book) => (
						<li key={book.id} className="flex w-full justify-between">
							<div className='flex gap-2'>
								<img
									src={book.image ?? "/book-placeholder.svg"}
									alt={book.title}
									className="h-30 w-20 object-cover"
								/>
								<div className="flex flex-col gap-2">
									<h2 className="text-lg font-medium">{book.title}</h2>
									<p>{book.authors[0]?.name ?? ""}</p>
								</div>
							</div>
							<div className='flex justify-center'>
								<Button onClick={() => onRemoveBook(book)}>Remove</Button>
								<Dialog open={open} onOpenChange={setOpen}>
									<DialogTrigger asChild>
										<Button>Change bookshelf</Button>
									</DialogTrigger>
									<MoveShelfDialog
										setIsOpen={(isOpen) => {
											setOpen(isOpen);
										}}
										refetch={refetchFull}
										userId={userId}
										book={book}
										bookshelfId={bookshelfId}
									/>
								</Dialog>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
