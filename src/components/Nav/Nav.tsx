import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Nav() {
  const { status, data: session } = useSession();

  let content = (
    <div className="flex items-center justify-between bg-gray-100/70 p-5">
      <p className="text-xl font-extrabold tracking-tight text-gray-800">{`Hi, ...`}</p>
      <div className="flex items-center justify-between gap-20">
        <Link
          href="/adventures"
          className="rounded-full px-10 py-3 font-bold text-gray-800 hover:bg-slate-300/30"
        >
          My Adventures
        </Link>
        <button
          className="rounded-full bg-slate-300 px-10 py-3 font-bold text-gray-800 no-underline transition hover:bg-slate-300/80"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );

  if (status === "authenticated") {
    content = (
      <div className="flex items-center justify-between bg-gray-100/70 p-5">
        <p className="text-xl font-extrabold tracking-tight text-gray-800">{`Hi, ${session.user.name}`}</p>
        <div className="flex items-center justify-between gap-20">
          <Link
            href="/adventures"
            className="rounded-full px-10 py-3 font-bold text-gray-800 hover:bg-slate-300/30"
          >
            My Adventures
          </Link>
          <button
            className="rounded-full bg-slate-300 px-10 py-3 font-bold text-gray-800 no-underline transition hover:bg-slate-300/80"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return content;
}
