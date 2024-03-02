import Link from "next/link";
import { Input } from "../shadcn/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import { Session } from "next-auth";
import { Button } from "../shadcn/ui/button";

export default function Nav({ session }: { session: Session | null }) {
  console.log(session);
  return (
    <nav className="flex items-center gap-5 bg-grey p-4 text-primary">
      {/* TODO Replace h1 with logo */}
      <h1 className="text-3xl font-bold text-primary">BetterReads</h1>
      <Link href="/home" className="w-fit hover:underline">
        <p>Home</p>
      </Link>
      <Link href="/home" className="w-32 hover:underline">
        <p>My Books</p>
      </Link>
      <Link href="/home" className="w-20 hover:underline">
        <p>Browse</p>
      </Link>
      <Link href="/home" className="w-20 hover:underline">
        <p>About</p>
      </Link>
      <Input placeholder="Search" className="shrink grow bg-white" />
      {session ? (
        <Avatar>
          <AvatarImage src={session.user.image || ""} alt="avatar" />
          <AvatarFallback>
            {session.user.name ? session.user.name[0] : ""}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button className="w-32" variant="secondary">
          <p>Sign in</p>
        </Button>
      )}
    </nav>
  );
}
