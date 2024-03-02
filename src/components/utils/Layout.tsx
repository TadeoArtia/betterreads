import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Session, getServerSession } from "next-auth";

import Nav from "./Nav";
import { authOptions } from "~/server/auth";
import { getProviders } from "next-auth/react";

export default function Layout({
  children,
  session,
}: {
  session: Session | null;
  children: React.ReactNode;
  }) {
  return (
    <div>
      <Nav session={session} />
      {children}
    </div>
  );
}
