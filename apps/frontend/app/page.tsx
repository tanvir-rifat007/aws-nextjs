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
    <div className="container mx-auto">
      <input
        type="text"
        name="text"
        placeholder="Enter your language"
        onChange={(e) => setText(e.target.value)}
        className="px-4 py-2 rounded w-full border mt-4"
      />
      <input
        type="text"
        name="sourceLang"
        placeholder="Your original language"
        onChange={(e) => setSourceLang(e.target.value)}
        className="px-4 py-2 rounded w-full border mt-4"
      />
      <input
        type="text"
        placeholder="Your translated language"
        name="targetLang"
        onChange={(e) => setTargetLang(e.target.value)}
        className="px-4 py-2 rounded w-full border mt-4"
      />
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        onClick={() => {
          startTransition(async () => {
            const res = await getTranslations();
            setAllTranslations(res);
            console.log(res);
          });
        }}
      >
        {isPending ? "Loading..." : "Get all translations"}
      </button>

      {getAllTranslations.map((translation) => (
        <div
          key={translation.requestId}
          className="
          border
          border-gray-200
          rounded
          p-4
          flex
          justify-between

        "
        >
          <p>{translation.sourceText}</p>
          <p>{translation.translatedText}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
