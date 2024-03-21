import { api } from "~/utils/api";

export default function BookShelfDetails({
  bookshelfId,
}: {
  bookshelfId: string;
}) {
  const { data: bookshelfData, isLoading } =
    api.bookshelves.getBookshelf.useQuery({
      id: bookshelfId,
    });

  if (isLoading || !bookshelfData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex grow flex-col gap-4 rounded-sm bg-grey px-4 py-4">
      <h1 className="text-xl font-medium">{bookshelfData.name}</h1>
      {bookshelfData ? (
        <ul className="flex flex-col gap-2">
          {bookshelfData.books.map((book) => (
            <li key={book.id} className="flex gap-2">
              <img
                src={book.image}
                alt={book.title}
                className="h-30 w-20 object-cover"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">{book.title}</h2>
                <p>{book.authors[0]?.name ?? ""}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
