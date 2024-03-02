import {Session} from "next-auth";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/shadcn/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "../shadcn/ui/avatar";
import {Button} from "../shadcn/ui/button";
import {Input} from "../shadcn/ui/input";

export default function Nav({session}: { session: Session | null }) {

	const router = useRouter();

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
			<Input placeholder="Search" className="shrink grow bg-white"/>
			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src={session.user.image ?? ""} alt="avatar"/>
							<AvatarFallback>
								{session.user.name ? session.user.name[0] : ""}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent >
						<DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
						<DropdownMenuItem onClick={() => signOut({callbackUrl: '/login'})}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

			) : (
				<Button className="w-32" variant="secondary">
					<p>Sign in</p>
				</Button>
			)}
		</nav>
	);
}
