import Layout from "~/components/utils/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
	const session = useSession();
	return <Layout>Home Page
	</Layout>;
}
