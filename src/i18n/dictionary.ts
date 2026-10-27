import type { en } from "./en";

type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepString<U>[]
    : T extends object
      ? { [K in keyof T]: DeepString<T[K]> }
      : T;

export type Dictionary = DeepString<typeof en>;

export type LegalBlock = Dictionary["privacy"]["sections"][number]["blocks"][number];
export type LegalSection = Dictionary["privacy"]["sections"][number];
