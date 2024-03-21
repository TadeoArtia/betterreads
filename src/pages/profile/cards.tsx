import {User} from "@prisma/client";
import Image from "next/image";
import {useState} from "react";
import {Button} from "~/components/shadcn/ui/button";
import {Input} from "~/components/shadcn/ui/input";
import {api} from "~/utils/api";

export default function Card(props: {
	data: User[] | any[],
	followingList: boolean,
	owner: User & { following: User[] }
	refetch: any
}) {
	const followMutation = api.user.addFollowingRelationship.useMutation();
	const unfollowMutation = api.user.removeFollowingRelationship.useMutation();


	const [filteredData, setFilteredData] = useState<User[] | any[]>(props.data);

	const filterData = (filterValue: string) => {
		setFilteredData(props.data.filter((user: User | any) => {
			return user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
				user.username.toLowerCase().includes(filterValue.toLowerCase())
		}));
	}

	async function onUnfollow(unfollowedId: string) {
		await unfollowMutation.mutateAsync({followerId: props.owner.id, followingId: unfollowedId}).then(async () => {
			await props.refetch();
		});
	}

	async function onFollow(followedId: string) {
		await followMutation.mutateAsync({id: followedId}).then(async () => {
			await props.refetch();
		});
	}

	async function onRemoveFollower(followerId: string) {
		await unfollowMutation.mutateAsync({followerId: followerId, followingId: props.owner.id}).then(async () => {
			await props.refetch();
		});
	}


	function showCorrespondentButton(user: User | any) {
		if (props.followingList) {
			return <Button onClick={() => onUnfollow(user.id)}>Unfollow</Button>
		} else {
			if (props.owner.following.find((followingUser: User) => followingUser.id === user.id)) {
				return <Button onClick={() => console.log('Unfollow')}>Remove follower</Button>
			} else {
				return (
					<div className='flex gap-3'>
						<Button onClick={() => onFollow(user.id)}>Follow</Button>
						<Button onClick={() => onRemoveFollower(user.id)}>Remove follower</Button>
					</div>
				)
			}
		}
	}

	return (
		<>
			<div className="flex justify-start items-center gap-4">
				<Input
					color={"white"}
					type="text"
					placeholder="Search"
					className="p-2 border border-gray-300 rounded-md bg-white w-1/4 shadow-md min-w-52"
					onChange={(e) => filterData(e.target.value)}
				/>
			</div>
			{
				filteredData.map((user: User | any, index: number) => (
					<main key={index}
						  className="m-0 flex flex-row justify-between gap-7 items-center rounded-md p-6 bg-white shadow-md hover:shadow-lg  hover:-translate-y-1 transition-all min-w-max">
						<div className="m-0 flex flex-row justify-between gap-7 items-center min-w-fit">
							<Image
								className="w-24 h-24 rounded-md"
								src={user.image || '/books.jpeg'}
								alt={user.name}
								width={100}
								height={100}
							/>
							<div className='flex flex-col items-start gap-1 min-w-fit'>
								<p className="text-center text-lg font-semibold min-w-fit">{user.name}</p>
								<p className="text-center text-sm font-semibold min-w-fit">{user.email}</p>
							</div>
						</div>

						<div className='justify-end pr-2 min-w-max'>
							{showCorrespondentButton(user)}
						</div>
					</main>
				))
			}
		</>
	);
}
