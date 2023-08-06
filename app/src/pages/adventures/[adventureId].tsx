import Layout from "@/layouts/layout";
import { api } from "@/utils/api";
import Head from "next/head";
import { useRouter } from "next/router";

export default function AdventureId() {
  const router = useRouter();
  const { data: adventure } = api.adventure.getById.useQuery(
    { adventureId: router.query.adventureId as string },
    { enabled: router.isReady }
  );

  let content;
  if (!router.isReady) {
    content = <div>Loading...</div>;
  }

  if (adventure) {
    content = <div>{adventure.adventureName}</div>;
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
