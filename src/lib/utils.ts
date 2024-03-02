import axios from "axios";
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function capitalize(str: string | undefined | null) {
	if (!str) return ""
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function uploadImageToImgur(file: Blob) {
	const data = new FormData();
	const imageblob = new Blob([file], {type: "image/png"});
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
