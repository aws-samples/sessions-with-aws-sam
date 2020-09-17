# Governance for Serverless Applications using AWS Config and AWS SAM

This group is broken into multiple parts.

## Part 1: Initial Setup
This template configures AWS Config to record data in a specific region. The template declares a main region for recording global resources and can be installed in other regions within the same account as well.

## Part 2: AWS managed rules
This template adds AWS managed rules to the currently existing AWS Config setup. These rules are sample rules with more found [here](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html).

## Part 3: Custom rules
This template adds custom rules that evaluate reported configurations against custom logic through the use of an AWS Lambda function

## Part 4: Making the initial setup reusable
This template uses pseudo parameters, intrinsic functions, and conditions to make the template reusable across regions and accounts. It also identifies an aggregate account capable of collecting data from sub-accounts

## Part 5: Putting it all together
This template utilizes the AWS::Serverless::Application resource type to add the managed and custom rules to the config template as nestaed stacks.
