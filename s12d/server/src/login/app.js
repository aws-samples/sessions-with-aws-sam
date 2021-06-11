// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

exports.handler = async (event, context, callback) => {

  const userEmailDomain = event.request.userAttributes.email.split("@")[1];
  const allowedDomain = 'amazon.com';

  if (userEmailDomain === allowedDomain) {
    callback(null, event);
  } else {
    const error = new Error(`Sorry, you need an ${allowedDomain} email address to use s12d.com`);
    callback(error, event);
  }
};