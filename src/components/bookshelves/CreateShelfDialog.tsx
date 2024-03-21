import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "~/components/shadcn/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/shadcn/ui/dialog";
import { Input } from "~/components/shadcn/ui/input";
import { api } from "~/utils/api";

export default function CreateShelfDialog({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [shelfName, setShelfName] = useState("");
  const createShelfMutation = api.bookshelves.create.useMutation();

  const handleCreateShelf = async () => {
    if (!shelfName) return;
    await createShelfMutation.mutateAsync({ name: shelfName });
    setShelfName("");
    setIsOpen(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create new shelf</DialogTitle>
        <DialogDescription>
          Create a new shelf to organize your books
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={shelfName}
            onChange={(e) => setShelfName(e.target.value)}
            placeholder="Owned books"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreateShelf}> Create shelf</Button>
      </DialogFooter>
    </DialogContent>
  );
}
