// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {S3} from "aws-sdk";
import {generate} from 'short-uuid'
const s3 = new S3()

exports.handler = async function (event: any) {
  const now = new Date()
  const shortId = generate();

  let params = {
    Bucket: process.env.STORAGE_BUCKET,
    Key: event.key,
    Expires: event.expiration || (15*60)
  }

  try {
    let results = await s3.getSignedUrlPromise('getObject', params)
    return {
      id: shortId,
      signedUrl: results,
      ttl: (Math.round(now.getTime() / 1000) + params.Expires).toString()
    };
  } catch (error) {
    throw new Error(error.message)
  }
}