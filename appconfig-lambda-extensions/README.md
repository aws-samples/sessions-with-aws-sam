# Using AWS AppConfig with AWS Lambda Extensions

## Description

This is an example of how [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) can be used with [AWS Lambda](https://aws.amazon.com/lambda/) and [Lambda Extensions](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-extensions-in-preview/). Using AppConfig to separate your application configuration from your application code is good practice. By using that, you are able to deploy configuration changes independently from your code. AWS AppConfig helps us achieve that.

This example will deploy a sample serverless applications with AWS AppConfig and the AppConfig Lambda layer needed for AWS Lambda Extensions using AWS SAM. These are the resources being deployed:

* Lambda Function
* Lambda IAM Role
* Lambda Permissions for AppConfig
* HTTP API
* AppConfig Application
* AppConfig Environment
* AppConfig Deployment Strategy
* AppConfig Configuration Profile
* AppConfig Hosted Configuration Version
* AppConfig Deployment

## How to install using AWS SAM

1. Install [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
2. Build using AWS SAM CLI.
```bash
sam build
```
3. Deploy using AWS SAM CLI and follow prompts.
```bash
sam deploy --guided
```
4. Use HTTP API endpoint from SAM CLI output to test application. If successfully deployed, you should get the following message.
```bash
"Hello from Lambda!"
```

## How to use after deployment

1. Open AppConfig in the AWS Console and browse to the hosted configuration for the deployed application. Link available in the output of SAM CLI after deployment.
2. Click "Create" and update the content with new configuration. Save by clicking "Create hosted configuration version".
```json
{
  "isEnabled": true,
  "messageOption": "AppConfig"
}
```
3. Click "Start deployment" and select the environment, the latest version of the hosted configuration, and the deployment strategy. Press "Start deployment" to start the deployment of the new configuration version.
4. If validation of the updated configuration passes, you will be sent to the status page of the deployment.
5. Test the new configuration by using the HTTP API endpoint from SAM CLI output. Remember that the AWS AppConfig extension uses caching that is configureable in the SAM template.
```bash
"Hello from AppConfig!"
```


## Notes

* The initial configuration is deployed using the AppConfigLambdaConfigurationVersion resource in template.yaml.
```yaml
AppConfigLambdaConfigurationVersion:
  Type: AWS::AppConfig::HostedConfigurationVersion
  Properties:
    ApplicationId: !Ref AppConfigLambdaApplication
    ConfigurationProfileId: !Ref AppConfigLambdaConfigurationProfile
    Content: '{ "isEnabled": false, "messageOption": "AppConfig" }'
    ContentType: 'application/json'
```
* The validation schema is deployed using the AppConfigLambdaConfigurationProfile resource in template.yaml.
```yaml
AppConfigLambdaConfigurationProfile:
  Type: 'AWS::AppConfig::ConfigurationProfile'
  Properties:
    Name: AppConfigLambda
    ApplicationId: !Ref AppConfigLambdaApplication
    LocationUri: hosted
    Validators:
      - Content: '{ "$schema": "http://json-schema.org/draft-04/schema#", "type": "object", "properties": { "isEnabled": { "type": "boolean" }, "messageOption": { "type": "string", "minimum": 0 } }, "required": ["isEnabled", "messageOption"] }'
        Type: JSON_SCHEMA
```
* The caching and timeout behavior of AppConfig can be changed by uncommenting and changing the values in template.yaml.
```yaml
# AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS: 45
# AWS_APPCONFIG_EXTENSION_POLL_TIMEOUT_MILLIS: 3000
```

## Contributors

**Gunnar Grosch** - [GitHub](https://github.com/gunnargrosch) | [Twitter](https://twitter.com/gunnargrosch) | [LinkedIn](https://www.linkedin.com/in/gunnargrosch/)
