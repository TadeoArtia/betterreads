import {useParams} from "next/navigation";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Button} from "~/components/shadcn/ui/button";
import {Dialog, DialogTrigger} from "~/components/shadcn/ui/dialog";
import {Separator} from "~/components/shadcn/ui/separator";
import {isSystemBookshelf} from "~/lib/utils";
import {api} from "~/utils/api";
import CreateShelfDialog from "./CreateShelfDialog";

// Define the ListBookshelves type
export type ListBookshelvesRef = {
	refresh: () => void;
};

interface Props {
	userId: string
	selectedBookshelfId: string
	setSelectedBookshelfId: (id: string) => void;
}

const ListBookshelves = forwardRef<ListBookshelvesRef, Props>((props, ref) => {
	const {userId, selectedBookshelfId, setSelectedBookshelfId} = props;
	const {data: userBookshelves, refetch} =
		api.bookshelves.userBookshelves.useQuery({
			userId,
		});

	const [isMounted, setIsMounted] = useState(false);

	// Pass the ref to the useImperativeHandle hook
	useImperativeHandle(ref, () => ({
		refresh: () => {
			refetch();
		}
	}));

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const [open, setOpen] = useState(false);
	const {id} = useParams<{ id: string }>();
	return (
		<aside className="flex w-1/6 max-w-xs flex-col  items-start justify-start  gap-4 bg-grey-variation py-4">
			<h3 className="w-full text-lg font-medium">Bookshelves</h3>
			{userBookshelves
			?.filter((x) => isSystemBookshelf(x.id))
			.map((bookshelf) => (
				<button
					key={bookshelf.id}
					onClick={() => setSelectedBookshelfId(bookshelf.id)}
					className={`${selectedBookshelfId == bookshelf.id ? "font-medium" : ""} w-full px-4 py-2 text-left hover:underline`}
				>
					{bookshelf.name} ({bookshelf._count.books})
				</button>
			))}
			<Separator/>
			{userBookshelves
			?.filter((x) => !isSystemBookshelf(x.id))
			.map((bookshelf) => (
				<button
					key={bookshelf.id}
					onClick={() => setSelectedBookshelfId(bookshelf.id)}
					className={`${selectedBookshelfId == bookshelf.id ? "font-medium" : ""} w-full px-4 py-2 text-left hover:underline`}
				>
					{bookshelf.name} ({bookshelf._count.books})
				</button>
			))}
			{isMounted ? (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>Create new shelf</Button>
					</DialogTrigger>
					<CreateShelfDialog
						setIsOpen={(isOpen) => {
							setOpen(isOpen);
							refetch();
						}}
					/>
				</Dialog>
			) : (
				<Button>Create new shelf</Button>
			)}
			<Separator/>
		</aside>
	);
});

export default ListBookshelves;
