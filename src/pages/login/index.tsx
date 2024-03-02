import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/components/shadcn/ui/form";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";

import { Button } from "~/components/shadcn/ui/button";
import Image from "next/legacy/image";
import { Input } from "~/components/shadcn/ui/input";
import Link from "next/link";
import React from "react";
import { Separator } from "~/components/shadcn/ui/separator";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import router from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Home({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const handleLogin = async (data: LoginFormData) => {
    const response = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (response?.ok) {
      await router.push("/");
    } else {
      // toast({
      //   title: "Error",
      //   description: "Usuario o contraseña incorrectos",
      // });
      console.error("Usuario o contraseña incorrectos");
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
            Login
          </h1>
          <p className="mb-6 w-3/4 text-dark-grey">
            Access your account to meet your new favourite book
          </p>

          <Form {...form}>
            <div className="flex w-3/4 flex-col gap-5">
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
                  </FormItem>
                )}
              />
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <Button
                type="submit"
                className="w-full"
                onClick={form.handleSubmit((data) => handleLogin(data))}
              >
                Login
              </Button>
            </div>
          </Form>
          <Link
            className="mt-1 w-3/4 text-center text-xs text-primary hover:underline"
            href="/forgot-password"
          >
            <p>Forgot your password?</p>
          </Link>
          <Separator className="my-3 w-3/4" />

          <div className="flex w-3/4 flex-col items-center justify-center gap-3 ">
            {Object.values(providers).filter((provider) => provider.id !== "credentials").map((provider) => (
              <button
                key={provider.id}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm text-background"
                onClick={() => signIn(provider.id)}
              >
                Sign in with {provider.name}
              </button>
            ))}
          </div>
          <Separator className="my-3 w-3/4 " />
          <span className="flex gap-2 text-xs">
            Dont have an account?
            <Link href="/register">
              <span className="w-3/4 text-center text-primary hover:underline">
                Create an account
              </span>
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers ?? [],
      csrfToken: "",
    },
  };
}
