// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from '@aws-cdk/core';
import { Tracing } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { JsonPath, Parallel, Pass, StateMachine, StateMachineType } from '@aws-cdk/aws-stepfunctions';
import { DynamoAttributeValue, DynamoPutItem, LambdaInvoke } from '@aws-cdk/aws-stepfunctions-tasks';
import { CfnOutput, Duration } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { HttpApi, CfnApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

export class CDKSignedurlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Amazon S3 storage bucket for uploaded files
    const storageBucket = new Bucket(this, 'StorageBucket')

    // Amazon DynamoDB table to store short urls
    const urlTable = new Table(this, 'MyDdb', {
      partitionKey: {name:'id', type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'TTL'
    });

    // AWS Lambda function to generate the signed upload URL
    const uploadSignerLambda = new NodejsFunction(this, 'UploadSignerLambda', {
      entry: 'lambda/uploadSigner.ts',
      handler: 'handler',
      environment: {
        'STORAGE_BUCKET': storageBucket.bucketName
      },
      tracing: Tracing.ACTIVE
    })

    // AWS Lambda function to generate the signed download URL
    const downloadSignerLambda = new NodejsFunction(this, 'DownloadSignerLambda', {
      entry: 'lambda/downloadSigner.ts',
      handler: 'handler',
      environment: {
        'STORAGE_BUCKET': storageBucket.bucketName,
      },
      tracing: Tracing.ACTIVE
    })

    // AWS Lambda function to process the shortened URL
    const fetchShortUrlLambda = new NodejsFunction(this, 'FetchShortUrlLambda', {
      entry: 'lambda/fetchShortUrl.ts',
      handler: 'handler',
      environment: {
        'URL_TABLE': urlTable.tableName
      },
      tracing: Tracing.ACTIVE
    })

    // Grants read rights to the short URL processor to read from the url DynamoDB table
    urlTable.grantReadData(fetchShortUrlLambda);

    // Grants rights for the upload URL generator function to create the upload signed URL
    uploadSignerLambda.addToRolePolicy(new PolicyStatement({
      actions:['s3:PutObject', 's3:PutObjectAcl', 's3:PutLifecycleConfiguration'],
      resources: [storageBucket.bucketArn, storageBucket.arnForObjects('*')]
    }))

    // Grants rights for the download URL generator function to create the download signed URL
    downloadSignerLambda.addToRolePolicy(new PolicyStatement({
      actions:['s3:GetObject', 's3:ListBucket', 's3:GetBucketLocation', 's3:GetObjectVersion', 's3:GetLifecycleConfiguration'],
      resources: [storageBucket.bucketArn, storageBucket.arnForObjects('*')]
    }))

    // AWS Step Functions tasks
    const writeToDynamoDB = new DynamoPutItem(this, 'WriteToDynamoDB', {
      table: urlTable,
      resultPath: '$.DynamoResults',
      outputPath: '$',
      item: {
        'id': DynamoAttributeValue.fromString(JsonPath.stringAt('$.DownloadSignResults.Payload.id')),
        'signedUrl': DynamoAttributeValue.fromString(JsonPath.stringAt('$.DownloadSignResults.Payload.signedUrl')),
        'TTL': DynamoAttributeValue.numberFromString(JsonPath.stringAt('$.DownloadSignResults.Payload.ttl'))
      }
    })

    const getUploadSignedUrl = new LambdaInvoke(this, 'GetUploadSignedUrl', {
      lambdaFunction: uploadSignerLambda,
      resultPath: '$.UploadSignResults'
    })

    const getDownloadSignedUrl = new LambdaInvoke(this, 'GetDownloadSignedUrl', {
      lambdaFunction: downloadSignerLambda,
      resultPath: '$.DownloadSignResults',
      outputPath: '$'
    })
    
    getDownloadSignedUrl.next(writeToDynamoDB)

    const formatResults = new Pass(this, 'formatResults', {
      parameters:{
        'UploadUrl.$': '$[0].UploadSignResults.Payload.signedUrl',
        'DownloadUrl.$': '$[1].DownloadSignResults.Payload.signedUrl',
        'DownloadShortId.$': '$[1].DownloadSignResults.Payload.id'
      }
    })

    const generateSignedUrls = new Parallel(this, 'Generate Signed URLs', {
      comment: 'Fetches a signed upload and download URL for the given Key',
    })
    
    generateSignedUrls.branch(getUploadSignedUrl).branch(getDownloadSignedUrl)

    // Step Functions state machine
    const urlStateMachine = new StateMachine(this, 'StateMachine', {
      definition: generateSignedUrls.next(formatResults),
      timeout: Duration.seconds(30),
      tracingEnabled: true,
      stateMachineType: StateMachineType.EXPRESS
    })
    
    // IAM role for HTTP APIs
    const httpApiRole = new Role(this, 'hHttpApiRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        AllowSFNExec: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['states:StartSyncExecution'],
              effect: Effect.ALLOW,
              resources: [urlStateMachine.stateMachineArn]
            })
          ]
        })
      }
    })

    // OpenAPI definition to handle AWS Integration
    const apiDefinition = {
      "openapi": "3.0.1",
      "info" : {
        "title" : "Signed URL Generator - Built with AWS CDK",
      },
      "paths": {
        "/" : {
          "post": {
            "responses": {
              "default": {
                  "description": "SFN Response"
              }
            },
            "x-amazon-apigateway-integration": {
              "integrationSubtype": "StepFunctions-StartSyncExecution",
              "credentials": httpApiRole.roleArn,
              "requestParameters": {
                  "Input": "$request.body",
                  "StateMachineArn": urlStateMachine.stateMachineArn
              },
              "payloadFormatVersion": "1.0",
              "type": "aws_proxy",
              "connectionType": "INTERNET"
            }
          }
        }
      }
    }

    // Amazon API Gateway HTTP APIs and
    const httpApi = new HttpApi(this, 'HttpApi');

    // Required to use HTTP API construct with OpenApi definition until there is a specific method
    // (See: https://dev.to/wojciechmatuszewski/starting-synchronous-express-workflows-with-api-gateway-and-cdk-367i)
    const cfnApi = httpApi.node.defaultChild as CfnApi;
    cfnApi.addPropertyOverride('Body', apiDefinition);
    cfnApi.addPropertyDeletionOverride('Name');
    cfnApi.addPropertyDeletionOverride('ProtocolType');

    // Adds an additional route for fetching the short URL
    httpApi.addRoutes({
      path: '/{id}',
      methods: [HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: fetchShortUrlLambda
      }),
    })

    // Outputs
    const apiUrlOut = new CfnOutput(this, 'API url', {
      value: httpApi.url!
    })

  }
}