#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CDKSignedurlStack } from '../lib/signedurl-stack';

const app = new cdk.App();
new CDKSignedurlStack(app, 'CDKSignedurlStack', {
  description: "CDK Signed Url Generator"
});
