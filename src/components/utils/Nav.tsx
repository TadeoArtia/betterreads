import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/shadcn/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

import {Button} from "../shadcn/ui/button";
import {Input} from "../shadcn/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav({ showSearch = true }: { showSearch?: boolean }) {
	const router = useRouter();
	const session = useSession();
	return (
		<nav className="flex items-center gap-5 bg-grey p-4 text-primary">
			{/* TODO Replace h1 with logo */}
			<h1 className="text-3xl font-bold text-primary">BetterReads</h1>
			<Link href="/" className="w-fit hover:underline text-nowrap">
				<p>Home</p>
			</Link>
			<Link href="/" className="w-32 hover:underline text-nowrap">
				<p>My Books</p>
			</Link>
			<Link href="/search" className="w-20 hover:underline text-nowrap">
				<p>Browse</p>
			</Link>
			<Link href="/about" className="w-20 hover:underline text-nowrap">
				<p>About</p>
			</Link>
			<Input placeholder="Search" className={`shrink grow bg-white ${showSearch ? "" : "invisible"}`}
				onKeyDown={
					(event) => {
						if (event.key === "Enter") {
							router.push(`/search?q=${event.currentTarget.value}`);
						}
					}
				} />


			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src={session.data?.user.image ?? ""} alt="avatar" />
							<AvatarFallback>
								{session.data?.user.name ? session.data.user.name[0] : ""}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent >
						<DropdownMenuItem onClick={() => router.push(`/profile/${session.data?.user.id}`)}>Profile</DropdownMenuItem>
						<DropdownMenuItem onClick={() => signOut({callbackUrl: '/login'})}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

			) : (
					<Button className="w-32" variant="secondary" onClick={() => router.push('/login')}>
					<p>Sign in</p>
				</Button>
			)}
		</nav>
	);
}
