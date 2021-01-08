// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');
const s3 = new AWS.S3()

exports.handler = async function (event) {

  let params = {
    Bucket: process.env.STORAGE_BUCKET,
    Key: event.key,
    Expires: event.expiration || (5*60),
    ContentType: event.contentType,
  }

  try {
    let results = await s3.getSignedUrlPromise('putObject', params)
    return {
      signedUrl: results
    };
  } catch (error) {
    throw new Error(error.message)
  }
}