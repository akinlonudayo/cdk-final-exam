import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';



export class CdkFinalExamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkFinalExamQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //     You are a Cloud Engineer working on a serverless application that requires the following AWS services using AWS CDK in TypeScript:
    // 1.	Lambda Function that handles HTTP requests
    // 2.	API Gateway to expose the Lambda function as a REST API
    // 3.	DynamoDB Table for storing data
    // 4.	IAM Role to grant the Lambda function necessary permissions
    // Task Requirements
    // ✅ Use AWS CDK with TypeScript
    // ✅ Create a Execution Role Lambda Role Permission with FullDynamoDBAccess
    // ✅ Create a Lambda function that inserts and retrieves data from DynamoDB
    // ✅ Deploy an API Gateway to invoke the Lambda function
    // ✅ Create a DynamoDB table with a primary key "id"
    // ✅ Grant the Lambda function permission to access DynamoDB

    // Note: Create a GitHub Project and Push your code in your github project and take screenshot for answers.

  const lambdaExecutionRole = new Role(this, 'LambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Execution role for Lambda with full DynamoDB access',
    });

    lambdaExecutionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );

    lambdaExecutionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    );

    new cdk.CfnOutput(this, 'LambdaExecutionRoleArn', {
      value: lambdaExecutionRole.roleArn,
    });

  const table = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'MyTable',
    });

    
  const lambdaFn = new lambda.Function(this, 'DynamoLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'app.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName,
      },
      role: lambdaExecutionRole,
    });

    table.grantReadWriteData(lambdaFn);

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: lambdaFn.functionName,
    });

  const api = new apigateway.LambdaRestApi(this, 'MyApi', {
      handler: lambdaFn,
      proxy: false,
      restApiName: 'ApiInvokeLambdaDynamoDB',
      description: 'API Gateway integrated with Lambda and DynamoDB'
      });
  }
}

