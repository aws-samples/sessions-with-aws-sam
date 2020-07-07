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

# Swift Lambda example with SAM
This projects builds two Lambda functions built with Swift. **Squared** is a simple Lambda that returns the squared value of a number. **SwiftApi** is a simple Lambda function that triggers from an HTTP API.

You will not need Swift installed locally as we will use an Amazon Linux container to build the functions.

## Prerequisites
1. [Docker](https://docker.com)
1. [SAM CLI >= 0.52.0](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

## Setup - Create docker image for compiling
```
docker build -t swift-lambda-builder .
```

## Build options

1. `sam build` from the root directory will compile each function and prepare for testing and deployment. *Note: that this will rebuild all functions.* [Docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-build.html)
1. `make build` from within the function folder, Squared or SwiftApi, will build the corresponding Lambda function only. *Note: this will update changed code only*

## Test Local
Run these commands from the root of the project.

### SwiftApi: SAM local doesn't support start-api for HTTP API as of yet. So you can invoke the Lambda with an HTTP API event.
```
sam local invoke SwiftApi -e api-event.json
```

### Squared
```
sam local invoke Squared -e events/squared.json
```

## Deployment
Use `sam deploy` from the root of the project. [Docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html)

## Credit
I used both these amazing resources to figure this out.
1. https://fabianfett.de/getting-started-with-swift-aws-lambda-runtime
1. https://github.com/swift-server/swift-aws-lambda-runtime

*Note: I am not an amazing makefile expert or Swift developer. Any feedback on my process is wanted and welcome*