import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";
export async function getTranslation({
  sourceLang,
  targetLang,
  sourceText,
}: {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
}) {
  const translateClient = new TranslateClient({});

  const translateCmd = new TranslateTextCommand({
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
    Text: sourceText,
  });
  const translatedText = await translateClient.send(translateCmd);

  return translatedText.TranslatedText;
}
