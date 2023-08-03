import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
        {" "}
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">{`Hi, ${session.user.name}`}</h1>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
          My Adventures
        </h1>
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
