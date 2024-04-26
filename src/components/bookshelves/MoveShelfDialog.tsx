import {Book} from "@prisma/client";
import {Check, ChevronsUpDown} from "lucide-react"
import {useState} from "react";
import {Button} from "~/components/shadcn/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "~/components/shadcn/ui/command";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/ui/dialog";
import {Label} from "~/components/shadcn/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/shadcn/ui/popover";
import {cn} from "~/lib/utils";
import {api} from "~/utils/api";


export default function MoveShelfDialog({
											setIsOpen, refetch, book, bookshelfId, userId
										}: {
	setIsOpen: (isOpen: boolean) => void;
	refetch: () => Promise<any>;
	book: Book,
	bookshelfId: string, userId: string
}) {

	const userBookshelves = api.bookshelves.userBookshelves.useQuery({
		userId,
	})?.data?.map((bookshelf) => ({
		label: bookshelf.name,
		value: bookshelf.id
	}))



	const [open, setOpen] = useState(false)
	const [value, setValue] = useState("")


	const removeBookMutation = api.bookshelves.removeBookFromBookshelf.useMutation();
	const addBookMutation = api.bookshelves.addBookToBookshelf.useMutation();

	const onMoveBook = async () => {
		await removeBookMutation.mutateAsync({
			bookshelfId,
			bookId: book.id,
		})
		await addBookMutation.mutateAsync({
			bookshelfId: value,
			bookId: book.id
		})
		await refetch()
		setIsOpen(false);
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Create new shelf</DialogTitle>
				<DialogDescription>
					Select the bookshelf you want to move the book to
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					{/*	START OF COMBO */}
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
								className="w-[200px] justify-between"
							>
								{value
									? userBookshelves?.find((bookshelf) => bookshelf.value === value)?.label
									: "Select bookshelf..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search bookshelf..."/>
								<CommandEmpty>No bookshelf found.</CommandEmpty>
								<CommandGroup>
									<CommandList>
										{userBookshelves?.map((bookshelf) => (
											<CommandItem
												key={bookshelf.value}
												value={bookshelf.value}
												onSelect={(currentValue) => {
													setValue(currentValue === value ? "" : currentValue)
													setOpen(false)
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														value === bookshelf.value ? "opacity-100" : "opacity-0"
													)}
												/>
												{bookshelf.label}
											</CommandItem>
										))}
									</CommandList>
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					{/*	END OF COMBO*/}
				</div>
			</div>
			<DialogFooter>
				<Button onClick={() => onMoveBook()}> Move book</Button>
			</DialogFooter>
		</DialogContent>
	);
}
