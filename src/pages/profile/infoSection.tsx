import {useSession} from "next-auth/react";
import Image from "next/legacy/image";
import {type ChangeEvent, useRef} from "react";
import {capitalize, uploadImageToImgur} from "~/lib/utils";
import {api} from "~/utils/api";

export default function InfoSection() {
	const session = useSession();
	const updateImageMutation = api.user.updateProfileImage.useMutation();
	const {data: userProfile, isLoading, refetch} = api.user.getUserProfile.useQuery({id: session.data?.user.id ?? ""});

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
			await updateImageMutation.mutateAsync(
				{
					image: url
				}
			);
			await refetch();
		} catch
			(error) {
			console.error('Error al subir la imagen:', error);
		}
	};

	if (!userProfile) return null;

	return (
		<div className='flex justify-between w-full px-20'>
			<div className='flex gap-5'>
				<div
					className="relative w-40 h-40 p-3 bg-dark-grey border-[12px] -top-20 -bottom-20 rounded-md">
					<div className="rounded-md overflow-hidden p-3">
						<input
							type="file"
							accept="image/*"
							ref={inputFileRef}
							style={{display: 'none'}}
							onChange={handleFileUpload}
						/>

						<Image src={userProfile.image ?? '/noprofile.jpeg'}
							   alt="Image"
							   layout='fill'
							   objectFit='cover'
							   className='hover:cursor-pointer hover:blur-sm transition-all'
							   onClick={handleImageClick}
						/>
					</div>
				</div>

				<div>
					<h1 className='text-2xl font-bold'>{capitalize(userProfile.name)}</h1>
					<p className='text-sm'>{userProfile.email}</p>
				</div>
			</div>

			<div className='flex justify-between gap-7 self-start pt-2'>
				<div>
					<p className='text-sm text-center font-semibold'>10</p>
					<h1 className='text-sm text-center'>Followers</h1>
				</div>
				<div>
					<p className='text-sm text-center font-semibold'>10</p>
					<h1 className='text-sm text-center'>Following</h1>
				</div>
				<div>
					<p className='text-sm text-center font-semibold'>10</p>
					<h1 className='text-sm text-center'>Posts</h1>
				</div>
			</div>


		</div>
	);
}
