"use server";

export const postTranslate = async (
  sourceLang: string,
  outputLang: string,
  text: string
) => {
  const response = await fetch(
    "https://scixng8mid.execute-api.eu-north-1.amazonaws.com/prod",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceLang,
        outputLang,
        text,
      }),
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Translation request failed");
  }

  return await response.json(); // Parse the JSON response
};
