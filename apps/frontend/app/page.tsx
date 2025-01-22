"use client";

import { postTranslate } from "@/actions/translate";
import { getTranslations } from "@/utils/translation";
import { useState, useTransition } from "react";

const HomePage = () => {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [result, setResult] = useState("");
  const [getAllTranslations, setAllTranslations] = useState([]);
  return (
    <>
      <input
        type="text"
        name="text"
        placeholder="Enter your language"
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        name="sourceLang"
        placeholder="Your original language"
        onChange={(e) => setSourceLang(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your translated language"
        name="targetLang"
        onChange={(e) => setTargetLang(e.target.value)}
      />
      <button
        type="submit"
        onClick={() => {
          startTransition(async () => {
            const res = await postTranslate(sourceLang, targetLang, text);
            console.log(res);
            setResult(res.translatedText);
          });
        }}
      >
        {isPending ? "Loading..." : "Translate"}
      </button>

      <p>{result}</p>

      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            const res = await getTranslations();
            console.log(res);
          });
        }}
      >
        {isPending ? "Loading..." : "Get all translations"}
      </button>
    </>
  );
};

export default HomePage;
