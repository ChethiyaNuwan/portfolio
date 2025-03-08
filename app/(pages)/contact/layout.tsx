import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chethiya Nuwan • Contact",
  description: "Get in touch with me. Connect for collaboration, questions, or just to say hello!",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
