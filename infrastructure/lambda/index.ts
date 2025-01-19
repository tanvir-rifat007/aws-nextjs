import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

import * as lambda from "aws-lambda";

import { TranslateRequest, TranslateResponse } from "@sf/shared-types";

const translateClient = new TranslateClient({});

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

    const body: TranslateRequest = JSON.parse(event.body);

    const translateCmd = new TranslateTextCommand({
      SourceLanguageCode: body.sourceLang,
      TargetLanguageCode: body.targetLang,
      Text: body.sourceText,
    });

    const translatedText = await translateClient.send(translateCmd);

    console.log(translatedText);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST",
    };

    if (!translatedText.TranslatedText) {
      return null;
    }

    const response: TranslateResponse = {
      message: "Hello from Lambda!",
      translatedText: translatedText.TranslatedText,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response),
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
