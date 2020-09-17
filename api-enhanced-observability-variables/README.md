# API Gateway enhanced observability variables

This example demonstrates using the new API Gateway enhanced observability variables to get the full story of an API Gateway request and response.

## Requirements
* AWS SAM CLI 1.0.0+

## Deployment
From the root of the project:
```bash
sam deploy -g
```

## Teardown:
Using the AWS CLI
```bash
aws cloudformation delete-stack --stack-name <your stack name on deployment>
```