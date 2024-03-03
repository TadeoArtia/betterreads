import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Session, getServerSession } from "next-auth";

import Nav from "./Nav";
import { authOptions } from "~/server/auth";
import { getProviders } from "next-auth/react";

export default function Layout({
  children,
  showSearch = true,
}: {
  children: React.ReactNode;
    showSearch?: boolean;
  }) {
  return (
    <div>
      <Nav showSearch={showSearch} />
      {children}
    </div>
  );
}
