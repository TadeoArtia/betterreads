import { BookBasicInfo } from "~/pages/search";

export default function BookCard(props: { book: BookBasicInfo }) {
    const { book } = props;
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-col justify-between overflow-hidden">
            {book.cover_i && <img src={"https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"} alt="" className="w-full h-full object-cover" />}
            {!book.cover_i && <div className="w-full h-full bg-gray-200" />}
            <span>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.subtitle}</p>
            </span>
            <span>
                <h3 className="text-lg font-thin">{book.author_name ? book.author_name.join(', ') : '-'}</h3>
            </span>
        </div>
    )


}