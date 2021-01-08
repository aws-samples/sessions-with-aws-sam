// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {S3} from "aws-sdk";
const s3 = new S3()

exports.handler = async function (event: any) {

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