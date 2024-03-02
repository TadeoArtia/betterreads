
export default function Card(props: {data: number}) {
	return (
		<main className="m-0 flex justify-start rounded-md p-10 bg-white">
			Card {props.data}
		</main>
	);
}
