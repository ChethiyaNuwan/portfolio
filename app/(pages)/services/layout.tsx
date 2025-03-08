import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chethiya Nuwan • Services",
  description: "Explore the services i offer. Professional web development, design, and software engineering solutions.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
