import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import Layout from "~/components/utils/Layout";
import { authOptions } from "~/server/auth";

export default function Home({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <Layout session={session}>Betterreads!</Layout>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
}
