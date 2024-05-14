import {createServerSideHelpers} from "@trpc/react-query/server";
import {GetServerSidePropsContext} from "next";
import {useParams} from "next/navigation";
import {useRef, useState} from "react";
import SuperJSON from "superjson";
import BookShelfDetails from "~/components/bookshelves/BookshelfDeatils";
import ListBookshelves, {ListBookshelvesRef} from "~/components/bookshelves/ListBookshelves";
import Layout from "~/components/utils/Layout";
import {appRouter} from "~/server/api/root";
import {db} from "~/server/db";

export default function Bookshelves() {
	const userId = useParams().id as string;
	const [selectedBookshelfId, setSelectedBookshelfId] = useState<string>(
		`want-to-read-${userId}`,
	);

	const ref = useRef<ListBookshelvesRef>(null);

	function refreshList() {
		ref?.current?.refresh()
	}

	return (
		<Layout>
			<main className="flex  w-full flex-1 justify-between bg-grey-variation px-20 py-4 gap-7">
				<div className='flex flex-col justify-start'>
					<ListBookshelves
						userId={userId}
						selectedBookshelfId={selectedBookshelfId}
						setSelectedBookshelfId={setSelectedBookshelfId}
						ref={ref}
					/>
					TEST
				</div>

				<section className="flex grow">
					<BookShelfDetails bookshelfId={selectedBookshelfId} userId={userId} refreshList={refreshList}/>
				</section>
			</main>
		</Layout>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const helpers = createServerSideHelpers({
		router: appRouter,
		ctx: {db: db, session: null},
		transformer: SuperJSON,
	});

	await helpers.bookshelves.userBookshelves.prefetch({
		userId: ctx.params?.id as string,
	});

	return {
		props: {
			trpcState: helpers.dehydrate(),
			invalidate: 1,
		},
	};
};
