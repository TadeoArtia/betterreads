import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/router";

import BookCard from "~/components/BookCard";
import BookSearch, {SearchType} from "~/components/BookSearch";
import Layout from "~/components/utils/Layout";

const pagesize = 10
const allFields = [
	"key",
	"title",
	"subtitle",
	"alternative_title",
	"alternative_subtitle",
	"cover_i",
	"isbn",
	"author_key",
	"author_name",
	"subject"]


export type BookBasicInfo = {
	key: string,
	title: string,
	cover_i: string,
	author_name: string[],
	isbn: string[],
	subject: string[],
	subtitle: string,
	alternative_title: string,
	alternative_subtitle: string,
	author_key: string[],
}


export default function Home() {
	const router = useRouter();
	const {q, page, radio} = router.query;
	const stringQueryParams = {
		q: q ? q.toString() : '',
		page: page ? page.toString() : '1',
		radio: radio ? radio.toString() : 'all'
	}

	const queryKey = ['search', q, page, radio]

	const {data: searchResults, isLoading} = useQuery(queryKey, async () => {
		if (!q) return {docs: []}
		const offset = (parseInt(stringQueryParams.page) - 1) * pagesize
		const paramMap: Record<SearchType, string> = {
			title: 'title',
			isbn: 'isbn',
			all: 'q',
			author: 'author'
		}

		let response = await axios.get('https://openlibrary.org/search.json', {
			params: {
				[paramMap[stringQueryParams.radio as SearchType]]: stringQueryParams.q,
				limit: pagesize,
				offset,
				fields: allFields.join(','),
			}
		})
		console.log(response.data)
		return response.data
	})

	return (<Layout showSearch={false}>
		<main
			className="flex flex-col items-center h-fit justify-center w-full px-20 py-10 text-center bg-grey-variation flex-grow">
			<BookSearch/>

			{isLoading && <p className="w-full h-full flex-grow">Loading...</p>}
			<div
				className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full h-full mt-4 px-4 sm:px-0">

				{searchResults && searchResults.docs.map((doc: BookBasicInfo) => {
					return (
						<BookCard key={doc.key} book={doc}/>
					)
				})}

			</div>
		</main>
	</Layout>);
}


