import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "node:path";

export class TempCdkStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // dynamodb construct;

    const table = new dynamodb.Table(this, "translations", {
      partitionKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const translateAccessPolicy = new iam.PolicyStatement({
      actions: ["translate:*"],
      resources: ["*"],
    });

    const api = new apiGateway.RestApi(this, "MyApiGatewayUsingNodejs");

    const lambdasDirPath = path.resolve(
      path.join("../", "packages/lambdas/translate/index.ts")
    );

    // lambda layers path:
    const lambdaLayersPath = path.resolve(
      path.join("../", "packages/lambda-layers/utils-lambda-layers")
    );

    console.log(lambdaLayersPath);

    const lambdaLayer = new lambda.LayerVersion(this, "utilsLambdaLayer", {
      code: lambda.Code.fromAsset(lambdaLayersPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // post lambda function
    const postLambda = new lambdaNodejs.NodejsFunction(
      this,
      "PostTranslateLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "translateText",
        entry: lambdasDirPath,
        initialPolicy: [translateAccessPolicy],
        layers: [lambdaLayer],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    // grant the lambda function read/write access to the dynamodb table
    table.grantReadWriteData(postLambda);

    // adding a lambda integration to the apiGateway
    api.root.addMethod("POST", new apiGateway.LambdaIntegration(postLambda));

    // get lambda function
    const getLambda = new lambdaNodejs.NodejsFunction(
      this,
      "GetTranslationsLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "getTranslations",
        entry: lambdasDirPath,
        initialPolicy: [translateAccessPolicy],
        layers: [lambdaLayer],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    // grant the lambda function read access to the dynamodb table
    table.grantReadData(getLambda);

    // adding a lambda integration to the apiGateway
    api.root.addMethod("GET", new apiGateway.LambdaIntegration(getLambda));
  }
}
