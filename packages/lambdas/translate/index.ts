import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import * as lambda from "aws-lambda";

import {
  TranslateDbObject,
  TranslateRequest,
  TranslateResponse,
} from "@sf/shared-types";

const { TRANSLATION_TABLE_NAME, TRANSLATION_PARTITION_KEY } = process.env;

console.log(
  "TRANSLATION_TABLE_NAME:",
  TRANSLATION_TABLE_NAME,
  "TRANSLATION_PARTITION_KEY:",
  TRANSLATION_PARTITION_KEY
);

if (!TRANSLATION_TABLE_NAME || !TRANSLATION_PARTITION_KEY) {
  throw new Error("Missing environment variables");
}

const translateClient = new TranslateClient({});
const dynamodbClient = new dynamodb.DynamoDBClient({});

export const translateText: lambda.APIGatewayProxyHandler = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
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

    // save to the dynamodb table
    const tableObj: TranslateDbObject = {
      requestId: context.awsRequestId,
      ...body,
      ...response,
    };

    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: TRANSLATION_TABLE_NAME,
      // wrapping the object in the marshall function to convert it to the dynamodb format
      Item: marshall(tableObj),
    };

    // save the object to the dynamodb table
    await dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));

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
