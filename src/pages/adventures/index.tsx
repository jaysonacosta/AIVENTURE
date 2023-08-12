import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import Layout from "@/layouts/layout";
import { api } from "@/utils/api";
import Adventure from "@/components/Adventure/Adventure";

export default function Adventures() {
  const { status } = useSession();
  const router = useRouter();
  const {
    data: adventures,
    isLoading,
    isSuccess,
  } = api.adventure.getAll.useQuery();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  let content;

  if (status === "loading") {
    content = <h1>Loading...</h1>;
  } else if (status === "authenticated") {
    content = (
      <div className="p-5">
        <div className="flex justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            My Adventures
          </h1>
          <Link href="/new-adventure">
            <button className="rounded-full bg-slate-300 px-10 py-3 font-bold text-gray-800 no-underline transition hover:bg-slate-300/80">
              New Adventure
            </button>
          </Link>
        </div>
        <br />
        {isLoading && <div>Loading...</div>}
        {isSuccess && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {adventures.map(
              ({ adventureName, characterName, updatedAt, id }) => {
                return (
                  <Link href={`adventures/${id}`} key={id}>
                    <Adventure
                      adventureName={adventureName}
                      characterName={characterName}
                      lastPlayed={updatedAt}
                    />
                  </Link>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AIVenture | Adventures</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>{content}</Layout>
    </>
  );
}
