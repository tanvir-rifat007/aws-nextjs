import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

import * as lambda from "aws-lambda";

const translateClient = new TranslateClient({});

type TranslateTextEvent = {
  sourceLang: string;
  outputLang: string;
  text: string;
};

export const translateText: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent
) => {
  console.log("Incoming Request Body:", event.body);

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No body found",
        }),
      };
    }

    const body: TranslateTextEvent = JSON.parse(event.body);

    const translateCmd = new TranslateTextCommand({
      SourceLanguageCode: body.sourceLang,
      TargetLanguageCode: body.outputLang,
      Text: body.text,
    });

    const translatedText = await translateClient.send(translateCmd);

    console.log(translatedText);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST",
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Hello from Lambda!",

        translatedText: translatedText.TranslatedText,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
