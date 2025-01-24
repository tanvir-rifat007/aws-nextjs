"use server";

import { TranslateRequest, TranslateResponse } from "@sf/shared-types";
import { revalidateTag } from "next/cache";

export const postTranslate = async (
  sourceLang: string,
  outputLang: string,
  text: string
) => {
  const request: TranslateRequest = {
    sourceLang,
    targetLang: outputLang,
    sourceText: text,
  };

  const response = await fetch(
    "https://nwtw317ise.execute-api.eu-north-1.amazonaws.com/prod/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Translation request failed");
  }

  revalidateTag("translations");

  return (await response.json()) as TranslateResponse;
};
