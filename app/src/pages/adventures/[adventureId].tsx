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
          {adventure.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        <div className="mt-5 flex flex-col gap-5">
          <p className="text-xl font-bold text-gray-800">Dungeon Master</p>
          <textarea
            className="w-full resize-none bg-slate-100 p-2 shadow"
            readOnly={true}
          ></textarea>
          <p className="text-xl font-bold text-gray-800">What will you do?</p>
          <input type="text" className=" h-12 w-full bg-slate-100 p-2 shadow" />
          <div className="flex gap-5">
            <button className="rounded bg-green-500 p-4 font-semibold text-white hover:bg-green-400">
              Submit
            </button>
            <button className="rounded bg-blue-500 p-4 font-semibold text-white hover:bg-blue-400">
              Give me some options
            </button>
          </div>
        </div>
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
