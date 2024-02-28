import { useSession } from "next-auth/react";
import Layout from "~/components/utils/Layout";

export default function Home() {
  const session = useSession();
  return <Layout session={session.data}>Betterreads!</Layout>;
}
