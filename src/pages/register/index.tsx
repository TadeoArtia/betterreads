import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/shadcn/ui/form";
import { Input } from "~/components/shadcn/ui/input";
import { Separator } from "~/components/shadcn/ui/separator";
import { api } from "~/utils/api";

export default function Home() {
  const registerSchema = z
    .object({
      username: z.string().min(1),
      password: z.string().min(8),
      email: z.string().email(),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ["confirm"], // path of error
    });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const defaultValues: Partial<RegisterFormData> = {
    username: "",
    password: "",
    email: "",
    confirm: "",
  };

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const createUserMutation = api.user.create.useMutation();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await createUserMutation.mutateAsync(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="m-0 flex h-screen w-screen items-center justify-center bg-grey">
      <div className="flex h-3/4 w-3/4 rounded-xl bg-light-grey">
        <div className="relative flex h-full w-3/5 items-center justify-center rounded-xl bg-color-primary">
          <Image
            className="rounded-xl"
            src="/books.jpeg"
            layout="fill"
            objectFit="cover"
            alt="Illustration Working"
          />
          <p>Meet your next favourite book!</p>
        </div>
        <div className="flex h-full w-2/5 flex-col items-center justify-center gap-1">
          <h1 className="mb-4 w-3/4 text-left text-3xl font-bold text-color-primary">
            Create an account
          </h1>
          <p className="mb-6 w-3/4 text-dark-grey">
            Access your account to meet your new favourite book
          </p>

          <Form {...form}>
            <div className="flex w-3/4 flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.confirm?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                onClick={form.handleSubmit((data) => onSubmit(data))}
              >
                Register
              </Button>
            </div>
          </Form>
          <Separator className="my-3 w-3/4" />

          <span className="flex gap-2 text-xs">
            Already have an account?
            <Link href="/login">
              <span className="w-3/4 text-center text-primary hover:underline">
                Login
              </span>
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}
