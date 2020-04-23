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

# Kinesis-Firehose and Kinesis Analytics

Amazon Kinesis Firehose SAM template for ingesting website access logs from Amazon API Gateway. The data is stored in a raw bucket, processed by a Lambda function, and then stored in a processed bucket as well. During the processing period, the data is also pushed to an Amazon DynamoDB table for real-time analytics.

## Resources according to data flow

### Firehose
This is the initial delivery stream to ingest large amounts of data

### RawDataBucket
This is the first step for the data. Raw data coming in to the Kinesis Dilvery Stream (Firehose) is first saved here in the format it comes in.

### ProcessFunction
After saving the data to the RawDataBucket, Kinesis then triggers this Lambda for any custom processing

### ProcessedDataTable
The process function pulls data and sends it to the ProcesseddataTable for immediate analytics

### ProcessedDataBucket
This bucket stors the data in it's processed state

### KinesisAnalyticsApp
Data is then sent to the KinesisAnalyticsApp for more in depth analysis and reporting

### KinesisAnalyticsOutput
This output directs analyzed data from Kinesis Analytics to the Count Function

### CountFunction
Count function takes the analyzed data and pushes it to the CountTable

### CountTable
Stores the latest top vied links as a trend