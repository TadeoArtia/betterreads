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
    const { query } = router;
    const page = query.page as string || '1'
    const [search, setSearch] = useState(query.q)
    const [debouncedSearch] = useDebounceValue(search, 250)

    const queryKey = ['search', debouncedSearch, page]

    const { data: searchResults, isLoading } = useQuery(queryKey, async () => {
        console.log('searching', debouncedSearch)
        if (!query.q) return;
        router.push({ query: { ...query, q: debouncedSearch, page: '1' } });
        const offset = (parseInt(page) - 1) * pagesize
        const response = await axios.get('https://openlibrary.org/search.json', {
            params: {
                q: debouncedSearch,
                limit: pagesize,
                offset,
                fields: allFields.join(','),
            }
        })
        return response.data
    })


    return (<Layout session={session.data}>
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />

        {isLoading && <p>Loading...</p>}
        {searchResults && searchResults.docs.map((doc: BookBasicInfo) => {
            return (<div key={doc.key} > {doc.title}
                <BookCard key={doc.key} book={doc} />
            </div>)
        })}

    </Layout >);
}
