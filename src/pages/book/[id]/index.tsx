import { getDescription, isValidGenre } from "~/lib/utils"

import { Button } from "~/components/shadcn/ui/button"
import Layout from "~/components/utils/Layout"
import Link from "next/link"
import { Separator } from "~/components/shadcn/ui/separator"
import axios from "axios"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function Home() {
    const params = useParams<{ id: string }>()
    console.log(params)
    const queryKey = ['book', params ? params.id : '-']
    const { data: searchResults, isLoading } = useQuery(queryKey, async () => {
        let response = await axios.get(`https://openlibrary.org/works/${params.id}.json`)
        console.log(response.data)
        return response.data
    })
    const { data: authorData, isLoading: authorLoading } = useQuery(['author', searchResults], async () => {
        if (!searchResults) return []
        let response = await axios.get(`https://openlibrary.org${searchResults.authors[0].author.key}.json`)
        return response.data
    })

    const [readMore, setReadMore] = useState(false)
    if (isLoading || authorLoading) return <div>Loading...</div>

    if (!searchResults) return <div>Not found</div>



    return (
        <Layout>
            <main className="flex  justify-between w-full flex-1 px-20 py-4 bg-grey-variation">
                <aside className="flex flex-col items-center justify-start  flex-1 py-4  bg-grey-variation gap-4">
                    {searchResults.covers && searchResults.covers.length > 0 &&
                        <img src={`https://covers.openlibrary.org/b/id/${searchResults.covers[0]}-L.jpg`} alt="book cover" />
                    }
                    <Button className="w-3/4"> Add to my library</Button>
                </aside>
                <section className="flex flex-col w-full flex-1 p-12  bg-grey-variation grow  gap-4">
                    <h1 className="text-3xl font-medium text-primary">{searchResults.title}</h1>
                    {authorData ? <h2 className="text-lg font-thin text-primary">{authorData.name}</h2> : null}
                    <p className={`text-md font-thin text-primary ${readMore ? '' : 'line-clamp-6'} w-full`}
                        dangerouslySetInnerHTML={{ __html: getDescription(searchResults) }}
                    >
                    </p>
                    <Button onClick={() => setReadMore(!readMore)}>{readMore ? 'Read less' : 'Read more'}</Button>
                    <div className="flex gap-4 flex-wrap w-full justify-between">
                        {searchResults.subjects?.filter(isValidGenre).map((subject: string, index: number) => {
                            return <Link key={index} href={`/search?q=${subject}`}
                                className="text-primary font-thin text-md hover:underline cursor-pointer "
                            >{subject}</Link>
                        })}
                    </div>
                    <Separator />
                    {searchResults.links?.map((link: any, index: number) => {
                        return <Link key={index} href={link.url}
                            className="text-primary font-thin text-sm hover:underline cursor-pointer "
                        >{link.title}</Link>
                    })}
                </section>

            </main>
        </Layout>
    )
}

