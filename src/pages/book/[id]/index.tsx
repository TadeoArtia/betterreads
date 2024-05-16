import { getDescription, isValidGenre } from "~/lib/utils";

import { Button } from "~/components/shadcn/ui/button";
import Layout from "~/components/utils/Layout";
import Link from "next/link";
import { Separator } from "~/components/shadcn/ui/separator";
import axios from "axios";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserReviews from "~/pages/book/[id]/userReviews";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

export default function Home() {
  const params = useParams<{ id: string }>();
  const session = useSession();
  const queryKey = ["book", params ? params.id : "-"];
  const { data: searchResults, isLoading } = useQuery(queryKey, async () => {
    let response = await axios.get(
      `https://openlibrary.org/works/${params.id}.json`,
    );
    return response.data;
  });
  const { data: authorData, isLoading: authorLoading } = useQuery(
    ["author", searchResults],
    async () => {
      if (!searchResults) return [];
      let response = await axios.get(
        `https://openlibrary.org${searchResults.authors[0].author.key}.json`,
      );
      return response.data;
    },
  );

  const [readMore, setReadMore] = useState(false);

  const addBookMutation = api.bookshelves.addBookToBookshelf.useMutation();
  const handleAddBook = async () => {
    if (!session.data?.user) return;
    await addBookMutation.mutateAsync({
      bookId: params.id,
      bookshelfId: `want-to-read-${session.data.user.id}`,
    });
    console.log("BOOK ADDED");
  };

  if (isLoading || authorLoading) return <div>Loading...</div>;
  if (!searchResults) return <div>Not found</div>;

  return (
    <Layout>
      <main className="flex  w-full flex-1 justify-between bg-grey-variation px-20 py-4">
        <aside className="flex flex-1 flex-col items-center  justify-start gap-4  bg-grey-variation py-4">
          {searchResults.covers && searchResults.covers.length > 0 && (
            <img
              src={`https://covers.openlibrary.org/b/id/${searchResults.covers[0]}-L.jpg`}
              alt="book cover"
            />
          )}
          <Button className="w-3/4" onClick={handleAddBook}>
            {" "}
            Add to my library
          </Button>
        </aside>
        <section className="flex w-full flex-1 grow flex-col  gap-4 bg-grey-variation  p-12">
          <h1 className="text-3xl font-medium text-primary">
            {searchResults.title}
          </h1>
          {authorData ? (
            <h2 className="text-lg font-thin text-primary">
              {authorData.name}
            </h2>
          ) : null}
          <p
            className={`text-md font-thin text-primary ${readMore ? "" : "line-clamp-6"} w-full`}
            dangerouslySetInnerHTML={{ __html: getDescription(searchResults) }}
          ></p>
          <Button onClick={() => setReadMore(!readMore)}>
            {readMore ? "Read less" : "Read more"}
          </Button>
          <div className="flex w-full flex-wrap justify-between gap-4">
            {searchResults.subjects
              ?.filter(isValidGenre)
              .map((subject: string, index: number) => {
                return (
                  <Link
                    key={index}
                    href={`/search?q=${subject}`}
                    className="text-md cursor-pointer font-thin text-primary hover:underline "
                  >
                    {subject}
                  </Link>
                );
              })}
          </div>
          <Separator />
          {searchResults.links?.map((link: any, index: number) => {
            return (
              <Link
                key={index}
                href={link.url}
                className="cursor-pointer text-sm font-thin text-primary hover:underline "
              >
                {link.title}
              </Link>
            );
          })}
        </section>
      </main>
      <UserReviews book={searchResults}/>
    </Layout>
  );
}
