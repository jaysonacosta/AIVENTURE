import { type ReactNode } from "react";
import Nav from "@/components/Nav/Nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}
