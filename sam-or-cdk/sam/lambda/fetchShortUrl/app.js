// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk')
const dc = new AWS.DynamoDB.DocumentClient()

exports.handler = async function (event) {
  let response = {
    "isBase64Encoded": false,
    "statusCode": 200,
    "body": JSON.stringify({"Message": "Signed URL not found or expired"}),
    "headers": {
      "Content-Type": "application/json",
      "Location": ""
    }
  }

  let params = {
    TableName: process.env.URL_TABLE,
    Key:{
      id: event.pathParameters.id,
    }
  }

  try{
    let data = await dc.get(params).promise()

    if(Object.keys(data).length > 0){
      response.statusCode = 302;
      response.headers.Location = data.Item.signedUrl,
      response.body = ""
    }
    return response
  } catch(error) {
    throw new Error(error.message)
  }
}
