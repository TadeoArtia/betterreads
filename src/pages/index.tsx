import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/legacy/image";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "~/components/shadcn/ui/button";
import {Form, FormControl, FormField, FormItem} from "~/components/shadcn/ui/form";
import {Input} from "~/components/shadcn/ui/input";

export default function Home() {
	const loginSchema = z.object({
		username: z.string().min(1),
		password: z.string().min(6),
	});

	type LoginFormData = z.infer<typeof loginSchema>;

	const defaultValues: Partial<LoginFormData> = {
		username: "",
		password: "",
	};

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues,
	});

	return (
		<div className="flex w-screen h-screen m-0 items-center justify-center bg-grey">
			<div className="flex w-3/4 h-3/4 bg-light-grey rounded-xl">
				<div className="flex w-3/5 h-full items-center justify-center bg-color-primary rounded-xl relative">
					<Image className='rounded-xl' src="/books.jpeg" layout="fill" objectFit='cover'
						   alt="Illustration Working"/>
					<p>Meet your next favourite book!</p>
				</div>
				<div className="flex flex-col w-2/5 h-full items-center justify-center">

					<h1 className="text-3xl font-bold text-color-primary mb-4 text-left w-3/4">Login</h1>
					<p className="text-dark-grey mb-6 w-3/4">Access your account to meet your new favourite book</p>

					{/*	ZOD FORM*/}
					<Form {...form}>
						<div className="w-3/4 gap-5 flex flex-col">
							<FormField
								control={form.control}
								name="username"
								render={({field}) => (
									<FormItem className="w-full">
										<FormControl>
											<Input {...field} className='w-full'
												   placeholder='Username'/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({field}) => (
									<FormItem className="w-full">
										<FormControl>
											<Input {...field} className='w-full' type='password'
												   placeholder='Password'/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full"
									onClick={form.handleSubmit((data) => console.log(data))}>
								Login
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}
