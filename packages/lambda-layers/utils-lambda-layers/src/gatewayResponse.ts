import * as lambda from "aws-lambda";

const createGatewayResponse = ({
  statusCode,
  body,
}: {
  statusCode: number;
  body: string;
}): lambda.APIGatewayProxyResult => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST",
    },
    statusCode,
    body,
  };
};

export const createSucessJsonResponse = (body: object) => {
  return createGatewayResponse({
    statusCode: 200,
    body: JSON.stringify(body),
  });
};

export const createErrorResponse = (error: Error) => {
  return createGatewayResponse({
    statusCode: 500,
    body: JSON.stringify({
      error: error.message,
    }),
  });
};
