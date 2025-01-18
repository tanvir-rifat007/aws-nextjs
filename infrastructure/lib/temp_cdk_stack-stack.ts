import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";

export class TempCdkStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const translateAccessPolicy = new iam.PolicyStatement({
      actions: ["translate:*"],
      resources: ["*"],
    });

    const lambdaFunc = new lambdaNodejs.NodejsFunction(
      this,
      "MyLambdaUsingNodejs",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "translateText",
        entry: "./lambda/index.ts",
        initialPolicy: [translateAccessPolicy],
      }
    );

    const api = new apiGateway.RestApi(this, "MyApiGatewayUsingNodejs");

    // adding a lambda integration to the apiGateway
    api.root.addMethod("POST", new apiGateway.LambdaIntegration(lambdaFunc));
  }
}
