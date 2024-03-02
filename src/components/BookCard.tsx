import { BookBasicInfo } from "~/pages/search";

export default function BookCard(props: { book: BookBasicInfo }) {
    const { book } = props;
    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex">
                <div className="flex-none w-48 relative">
                    <img src={"https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"} alt="" className="w-full h-full object-cover" />
                    {book.cover_i}
                </div>
            </div>
        </div>
    )


}