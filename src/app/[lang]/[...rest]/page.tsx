import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionaryOrDefault } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionaryOrDefault();
  return { title: dict.notFound.title };
}

export default function UnknownPage() {
  notFound();
}
