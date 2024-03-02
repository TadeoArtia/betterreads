import {useSession} from "next-auth/react";
import Image from "next/legacy/image";
import {type ChangeEvent, useRef} from "react";
import {uploadImageToImgur} from "~/lib/utils";
import {api} from "~/utils/api";

export default function Banner(props: {
	userProfile: any,
	refetch: any
}) {
	const session = useSession();
	const updateBannerImageMutation = api.user.updateBannerImage.useMutation();

	const inputFileRef = useRef<HTMLInputElement | null>(null);

	const handleImageClick = () => {
		inputFileRef.current?.click();
	};

	const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		if (!event?.target?.files) return;
		if (session.data?.user?.id === undefined) return;
		const file = event.target.files[0];
		if (!file) return;
		try {
			const url = await uploadImageToImgur(file);
			await updateBannerImageMutation.mutateAsync(
				{
					image: url
				}
			);
			await props.refetch();
		} catch
			(error) {
			console.error('Error al subir la imagen:', error);
		}
	};

	if (!props.userProfile) return null;

	return (
		<div className='w-full bg-white h-1/4 relative'>
			<input
				type="file"
				accept="image/*"
				ref={inputFileRef}
				style={{display: 'none'}}
				onChange={handleFileUpload}
			/>

			<Image src={props.userProfile.imageBanner ?? '/books.jpeg'}
				   alt="Image"
				   layout='fill'
				   objectFit='cover'
				   className='hover:cursor-pointer hover:blur-sm transition-all'
				   onClick={handleImageClick}
			/>

		</div>
	);
}
