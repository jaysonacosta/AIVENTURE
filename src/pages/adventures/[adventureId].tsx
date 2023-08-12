import Layout from "@/layouts/layout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";

export default function AdventureId() {
  const router = useRouter();
  const { status } = useSession();
  const { data: adventure, isLoading } = api.adventure.getById.useQuery(
    { adventureId: router.query.adventureId as string },
    { enabled: router.isReady }
  );
  const { data: adventureText, refetch } =
    api.adventureText.getAllByAdventureId.useQuery(
      { adventureId: router.query.adventureId as string },
      { enabled: router.isReady }
    );

  const createAdventureText = api.adventureText.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const [adventureInput, setAdventureInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  let content;
  if (!router.isReady || isLoading) {
    content = <div>Loading...</div>;
  }

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    createAdventureText.mutate({
      adventureId: router.query.adventureId as string,
      userInput: adventureInput,
    });
  };

  if (adventure && adventureText) {
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
          {adventureText.map(({ text, id }) => {
            return <p key={id}>{text}</p>;
          })}
          <p className="text-xl font-bold text-gray-800">What will you do?</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              className=" h-12 w-full bg-slate-100 p-2 shadow"
              value={adventureInput}
              onChange={(evt) => {
                setAdventureInput(evt.target.value);
              }}
            />
            <div className="flex gap-5">
              <button
                className="pfont-semibold rounded bg-green-500 p-4 text-white hover:bg-green-400"
                disabled={!adventureInput}
              >
                Submit
              </button>
            </div>
          </form>
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
