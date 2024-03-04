import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "~/components/shadcn/ui/button";
import { isSystemBookshelf } from "~/lib/utils";
import { api } from "~/utils/api";
import CreateShelfDialog from "./[id]/CreateShelfDialog";
import { Separator } from "~/components/shadcn/ui/separator";
import { Dialog, DialogTrigger } from "~/components/shadcn/ui/dialog";

export default function ListBookshelves({ userId }: { userId: string }) {
  const {
    data: userBookshelves,
    isLoading,
    refetch,
  } = api.bookshelves.userBookshelves.useQuery({
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
          <Link
            key={bookshelf.id}
            href={`/bookshelves/${id}/${bookshelf.id}`}
            className="hover:underline"
          >
            {bookshelf.name} ({bookshelf._count.books})
          </Link>
        ))}
      <Separator />
      {userBookshelves
        ?.filter((x) => !isSystemBookshelf(x.id))
        .map((bookshelf) => (
          <Link
            key={bookshelf.id}
            href={`/bookshelves/${id}/${bookshelf.id}`}
            className="hover:underline"
          >
            {bookshelf.name} ({bookshelf._count.books})
          </Link>
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
