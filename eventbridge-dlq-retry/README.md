# EventBridge with DLQ and RetryPolicy set

This template creates an HTTP API with a direct integration to the EventBridge default bus. It also creates an EventBridge rule with a Lambda function as a trigger. The template also configures a DLQ and a retry policy for the EventBridge rule.

deploy using `sam deploy -g`