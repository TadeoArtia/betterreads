import {User} from "@prisma/client";
import Image from "next/image";
import {useState} from "react";
import {Input} from "~/components/shadcn/ui/input";

export default function Card(props: { data: User[] | any[] }) {

	const [filteredData, setFilteredData] = useState<User[] | any[]>(props.data);

	const filterData = (filterValue: string) => {
		setFilteredData(props.data.filter((user: User | any) => {
			return user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
				user.username.toLowerCase().includes(filterValue.toLowerCase())
		}));
	}

	return (
		<>
			<div className="flex justify-start items-center gap-4">
				<Input
					color={"white"}
					type="text"
					placeholder="Search"
					className="p-2 border border-gray-300 rounded-md bg-white w-1/4"
					onChange={(e) => filterData(e.target.value)}
				/>
			</div>
			{
				filteredData.map((user: User | any, index: number) => (
					<main key={index} className="m-0 flex justify-start rounded-md p-6 bg-white">
						<div key={index} className="flex items-center justify-center gap-7">
							<Image
								className="w-24 h-24 rounded-md"
								src={user.image || '/books.jpeg'}
								alt={user.name}
								width={100}
								height={100}
							/>
							<div className='flex flex-col items-start gap-1'>
								<p className="text-center text-lg font-semibold">{user.name}</p>
								<p className="text-center text-sm font-semibold">@{user.username}</p>
							</div>
						</div>
					</main>
				))
			}
		</>
	);
}
