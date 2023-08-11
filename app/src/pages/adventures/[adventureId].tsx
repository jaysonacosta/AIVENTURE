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

  const [dmText, setDmText] = useState("");
  const [adventureInput, setAdventureInput] = useState("");
  const [adventureLog, setAdventureLog] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  let content;
  if (!router.isReady || isLoading) {
    content = <div>Loading...</div>;
  }

  useEffect(() => {
    //Initialize new adventures

    if (adventure) {
      setAdventureLog([
        {
          role: "user",
          content:
            "I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program. In this game, the setting is a fantasy adventure world. Each room should have at least 3 sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for my to give you my first command.",
        },
        {
          role: "assistant",
          content:
            "You find yourself standing at the entrance of a dimly lit cave. The air is damp, and the faint sound of dripping water echoes through the cavern. The mouth of the cave stretches wide in front of you, leading into darkness. Stalactites hang from the ceiling, and the ground is uneven beneath your feet. The path splits into three directions: the left passage appears narrow and steep, the middle path seems broader and less steep, while the right path is partially obscured by shadows. What would you like to do?",
        },
      ]);
      setDmText(
        "You find yourself standing at the entrance of a dimly lit cave. The air is damp, and the faint sound of dripping water echoes through the cavern. The mouth of the cave stretches wide in front of you, leading into darkness. Stalactites hang from the ceiling, and the ground is uneven beneath your feet. The path splits into three directions: the left passage appears narrow and steep, the middle path seems broader and less steep, while the right path is partially obscured by shadows. What would you like to do?"
      );
    }
  }, [adventure]);

  // handleSubmit = (evt: React.FormEvent) => {
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // Prevent the default form submission behavior

    setAdventureLog([
      ...adventureLog,
      { role: "user", content: adventureInput },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: adventureLog.concat({
            role: "user",
            content: adventureInput,
          }),
        }),
      });
      const resData = await response.json();

      setAdventureLog(resData.conversation);
      setDmText(adventureLog[adventureLog.length - 1].content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
          <p>{dmText}</p>
          <p className="text-xl font-bold text-gray-800">What will you do?</p>
          <form onSubmit={handleSubmit}>
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
