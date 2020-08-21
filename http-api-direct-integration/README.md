# HTTP API direct integration example

This template demonstrates using the new HTTP APIs direct integration to an Amazon SQS queue.

### Deployement
From this folder run:
```bash
sam deploy -g
```

### Testing
Update the '\<url\>' with your URL after deployment
```bash
curl --location --request POST '<url>' \
--header 'Content-Type: application/json' \
--data-raw '{"MessageBody":"This is my message"}'
```