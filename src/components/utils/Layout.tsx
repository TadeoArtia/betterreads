import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Session, getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { authOptions } from "~/server/auth";
import Nav from "./Nav";

export default function Layout({
  children,
  session,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  console.log("LAYOUT", session);
  return (
    <div>
      <Nav session={session} />
      {children}
    </div>
  );
}
