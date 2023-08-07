import Layout from "@/layouts/layout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdventureId() {
  const router = useRouter();
  const { status } = useSession();
  const { data: adventure, isLoading } = api.adventure.getById.useQuery(
    { adventureId: router.query.adventureId as string },
    { enabled: router.isReady }
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  let content;
  if (!router.isReady || isLoading) {
    content = <div>Loading...</div>;
  }

  if (adventure) {
    content = (
      <div className="p-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
          {adventure.adventureName}
        </h1>
        <h2 className="text-xl font-bold tracking-tight text-gray-600">
          {adventure.characterName}
        </h2>
        <h3 className="text-lg font-bold tracking-tight text-gray-400">
          {adventure.createdAt.toISOString()}
        </h3>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>AIVenture | Adventure</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>{content}</Layout>
    </>
  );
}
