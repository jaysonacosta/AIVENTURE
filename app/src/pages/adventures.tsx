import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Adventures() {
  const { status, data: session } = useSession();
  const router = useRouter();

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
      <>
        <div className="flex items-center justify-between bg-gray-100/70 p-5">
          <p className="text-xl font-extrabold tracking-tight text-gray-800">{`Hi, ${session.user.name}`}</p>
          <button
            className="rounded-full bg-slate-300 px-10 py-3 font-bold text-gray-800 no-underline transition hover:bg-slate-300/80"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
              My Adventures
            </h1>
            <button className="rounded-full bg-slate-300 px-10 py-3 font-bold text-gray-800 no-underline transition hover:bg-slate-300/80">
              New Adventure
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>AIVenture | Adventures</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">{content}</main>
    </>
  );
}
