# Governance for Serverless Applications using AWS Config and AWS SAM

This group is broken into multiple parts.

## Part 1: Initial Setup
This template configures AWS Config to record data in a specific region. The template declares a main region for recording global resources and can be installed in other regions within the same account as well.

## Part 2: AWS managed rules
This template adds AWS managed rules to the currently existing AWS Config setup. These rules are sample rules with more found [here](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html).

## Part 3: custom rules
This template adds custom rules that evaluate reported configurations against custom logic through the use of an AWS Lambda function