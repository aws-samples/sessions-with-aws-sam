/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message:'You have reached the admin portal'}),
  };
};