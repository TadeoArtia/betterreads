import BookSearch, { SearchType } from "~/components/BookSearch";
import { useEffect, useState } from "react";

import BookCard from "~/components/BookCard";
import { Input } from "~/components/shadcn/ui/input";
import Layout from "~/components/utils/Layout";
import axios from "axios";
import { useDebounceValue } from 'usehooks-ts'
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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
    const session = useSession();
    const router = useRouter();
    const { q, page, radio } = router.query;
    const stringQueryParams = { q: q ? q.toString() : '', page: page ? page.toString() : '1', radio: radio ? radio.toString() : 'all' }

    const queryKey = ['search', q, page, radio]

    const { data: searchResults, isLoading } = useQuery(queryKey, async () => {
        if (!q) return { docs: [] }
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

    return (<Layout session={session.data}>
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 py-4 text-center bg-grey-variation">
            <BookSearch />

        {isLoading && <p>Loading...</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full mt-4 px-4 sm:px-0">

        {searchResults && searchResults.docs.map((doc: BookBasicInfo) => {
            return (
                <BookCard key={doc.key} book={doc} />
            )
        })}

            </div>
        </main>
    </Layout >);
}
