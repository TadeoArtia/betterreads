import Nav from "./Nav";

export default function Layout({
								   children,
								   showSearch = true,
							   }: {
	children: React.ReactNode;
	showSearch?: boolean;
}) {
	return (
		<div className='flex flex-col grow'>
			<Nav showSearch={showSearch}/>
			{children}
		</div>
	);
}
