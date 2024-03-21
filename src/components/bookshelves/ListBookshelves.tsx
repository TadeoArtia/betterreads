import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "~/components/shadcn/ui/button";
import { isSystemBookshelf } from "~/lib/utils";
import { api } from "~/utils/api";
import CreateShelfDialog from "./CreateShelfDialog";
import { Separator } from "~/components/shadcn/ui/separator";
import { Dialog, DialogTrigger } from "~/components/shadcn/ui/dialog";

export default function ListBookshelves({
  userId,
  selectedBookshelfId,
  setSelectedBookshelfId,
}: {
  userId: string;
  selectedBookshelfId: string;
  setSelectedBookshelfId: (id: string) => void;
}) {
  const { data: userBookshelves, refetch } =
    api.bookshelves.userBookshelves.useQuery({
      userId,
    });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  return (
    <aside className="flex w-1/6 max-w-xs flex-1 flex-col  items-start justify-start  gap-4 bg-grey-variation py-4">
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
      <Separator />
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
      <Separator />
    </aside>
  );
}
