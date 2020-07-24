<!-- Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
//
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.
//
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->

# Sessions With SAM

This repo contains all the SAM templates created in the Twitch series #SessionsWithSAM. The show is every Thursday on [Twitch](https://twitch.tv/aws) at 10 AM PDT.

# Episodes


### Simple HTTP API with JWT Authorizer
In this episode I build a SAM template for HTTP API with a non-authenticated route and an authenticated route.

[Code](./http-api/README.md) | [Video](https://youtu.be/klOScYEojzY)

### Cognito and HTTP API
In this episode I talk through building an Amazon Cognito identity provider for HTTP API and JWT authorization. I also talk through using Cognito user groups as custom scopes for route access.

[Code](./cognito/README.md) | [Video](https://youtu.be/nBtWCjKd72M)

### EventBridge

In this session we build a custom EventBridge bus and an HTTP API endpoint to push data into it. We also add multiple rules to trigger Lambda functions for asynchronous processing.

[Code](./eventbridge/README.md) | [Video](https://youtu.be/73R02KufLac)

### Building a Kinesis Firehose application for ingesting website access logs

In this session we build an Amazon Kinesis Firehose SAM template for ingesting website access logs from Amazon API Gateway. The data is stored in a raw bucket, processed by a Lambda function, and then stored in a processed bucket as well. During the processing period, the data is also pushed to an Amazon DynamoDB table for real-time analytics.

[Code](./kinesis-firehose/README.md) | [Video](https://youtu.be/jdTBtaxs0hA)

### Analyzing API Gateway access logs using Kinesis

Continuing from session 4, this session adds a Kinesis Data Analytics application to create real-time analytics from API Gateway access logs. The entire application is built using SAM templates and the SAM CLI.

[Code](./kinesis-firehose/README.md) | [Video](https://youtu.be/ce0v-q9EVTQ)

### SAM templates for SQS, cross-account queue policies & Lambda event sources

In this session with SAM we build an AWS SAM template for creating an Amazon SQS queue. We also connect the queue as an event source for a Lambda function. Finally we create a queue policy to allow cross account posting to the queue and show how to test it in Postman.

[Code](./SQS/README.md) | [Video](https://youtu.be/q2rbHMyJBDY)

### Creating safe linear and canary deploys for Lambda functions

In this session I show how to use SAM to create safe deployments for Lambda functions in serverless applications. I demonstrate linear and canary deployments and how to configure pre and post traffic tests.

[Code](./safe-deploy/README.md) | [Video](https://youtu.be/RE4r_6edaXc)

### SAM templates for HTTP API and REST API custom domains

In this session I create a SAM template that builds a custom domain for API Gateway HTTP APIs and REST APIs. The template generates the hosted zone and ssl cert as well. I also show how to attach the same custom domain to both HTTP API and REST API at the same time.

[Code](./custom-domains/README.md) | [Video](https://youtu.be/4uXEGNKU5NI)

### Managing AWS Step Functions as IaC with SAM

In this episode I am joined by AWS Serverless DA Rob Sutter. Together we talk through the new Step Functions state machine support in AWS SAM.

[Code](./step-functions/README.md) | [Video](https://youtu.be/BguUgdZwymQ)

### Creating a Lambda function with an Amazon EFS mounted using SAM

In this episode James Beswick and I talk through configuring Amazon EFS for Lambda functions. This includes configuring EFS in a VOC as well. All by using SAM and SAM CLI.

[Code](https://github.com/aws-samples/aws-lambda-efs-samples) | [Video](https://youtu.be/up1op216trk)

### Using SAM and Stackery to build .Net Lambda functions

In this episode, I am joined by Chase Douglas, Stackery CTO. We talk through using SAM with Stackery to manage .NET Serverless applications.

[Code](./dotnet-api/README.md) | [Video](https://youtu.be/PGA8hbydHUA)

# Additonal Templates

These templates do not have an accompanying episode or it has not aired yet.

### HTTP API Access logging
This template shows how to setup access logging on an HTTP API gateay.

[Code](./http-api-logging/README.md)

### Building custom runtime - Swift example

This projects builds two Lambda functions built with Swift. Squared is a simple Lambda that returns the squared value of a number. SwiftApi is a simple Lambda function that triggers from an HTTP API.

[Code](./swift-custom-runtime/README.md)

### HTTP API http proxy for SQS

This project builds an HTTP API with a proxy in front of an SQS queue. Warning, the QUEUE is open to the public and cannot be limited to the HTTP API in this fashin.

[Code](./http-api-sqs)

- - - - - - - - - - - - - - - - - - - - - - - -

*See the full YouTube playlist [https://slip.link/sws-vids](https://slip.link/sws-vids)*
