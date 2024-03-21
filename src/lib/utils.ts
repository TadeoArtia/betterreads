import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import html from "remark-html";
import { remark } from "remark";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string | undefined | null) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function uploadImageToImgur(file: Blob) {
  const data = new FormData();
  const imageblob = new Blob([file], { type: "image/png" });
  data.append("image", imageblob, "image.png");

  try {
    const response = await axios.post("https://api.imgur.com/3/upload", data, {
      headers: {
        Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
      },
    });

    const dataResp = response.data as { data: { link: string } };
    if (!dataResp.data.link) throw new Error();
    return dataResp.data.link;
  } catch (err) {
    console.error(err);
    throw new Error("Error uploading image to imgur");
  }
}

export function isValidGenre(genre: string) {
  // Genres should not contain any special characters or numbers nor should they container Bestseller
  // as it is not a genre but a classification
  if (genre.toLowerCase().includes("bestseller")) return false;
  if (genre.toLowerCase().includes("imaginary")) return false;

  //First word should be capitalized
  if (!/^[A-Z]/.test(genre)) return false;

  if (genre.length > 50) return false;
  if (genre.toUpperCase() === genre) return false;
  if (genre.toLowerCase() === genre) return false;

  return /^[a-zA-Z\s]+$/.test(genre);
}

export const getDescription = (searchResults: any) => {
  let desc = "";
  if (typeof searchResults.description === "string")
    desc = searchResults.description;
  if (typeof searchResults.description?.value === "string")
    desc = searchResults.description.value;
  //Desc is in markdown use remark to parse it
  if (desc.includes("-----")) desc = `${desc.split("-----")[0]}\n` ?? "";
  // Remove sources from description
  // ([source][1])
  desc = desc.replaceAll(/\[([^\]]+)\]\[[0-9]+\]/g, "").replaceAll("()", "");

  // if it at any points contains a line ending in : remove it

  let parsed = remark().use(html).processSync(desc).toString();

  // If there is any p tag whose text ends in : remove the whole p tag
  parsed = parsed.replaceAll(/<p>([^:]+):<\/p>/g, "");
  // Replace all hrefs to openlibrary/works/id/title with /book/id
  parsed = parsed.replaceAll(
    /href="https:\/\/openlibrary\.org\/works\/([A-Za-z0-9_-]+)(\/[^"]*)?"/g,
    'href="/book/$1"',
  );
  return parsed;
};

export const isSystemBookshelf = (id: string) => {
  return (
    id.startsWith("want-to-read-") ||
    id.startsWith("currently-reading-") ||
    id.startsWith("read-")
  );
};
