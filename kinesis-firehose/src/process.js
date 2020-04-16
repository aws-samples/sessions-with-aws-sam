// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// //
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
// //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const AWS = require('aws-sdk')
const dc = new AWS.DynamoDB.DocumentClient()
const TTL = 10

exports.handler = async (event) => {
  let items = []
  let now = Date.now();

  event.records.map(record => {
    let buff = new Buffer.from(record.data, 'base64');
    let text = buff.toString('utf-8');

    let params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: record.recordId,
        createdTime: now,
        ttl: now + TTL * 60 * 1000,
        ...JSON.parse(text)
      },
      ConditionExpression: 'attribute_not_exists(id)'
    }

    items.push(dc.put(params).promise())
  })

  try {
    await Promise.all(items)
  } catch (err) {
    console.log(err.message);
  }

  return {
    records: event.records
  }
}