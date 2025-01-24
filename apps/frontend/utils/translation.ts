"use server";

import { TranslateDbObject } from "@sf/shared-types";
import { memoize } from "nextjs-better-unstable-cache";

export const getTranslations = memoize(
  async () => {
    const response = await fetch(
      "https://nwtw317ise.execute-api.eu-north-1.amazonaws.com/prod/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch translations");
    }

    const data = (await response.json()) as TranslateDbObject[];
    console.log(data);

    return data;
  },
  {
    persist: true,
    log: ["datacache", "dedupe", "verbose"],
    revalidateTags: ["translations"],
  }
);
