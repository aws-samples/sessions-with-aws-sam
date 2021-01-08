import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Signedurl from '../lib/signedurl-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Signedurl.CDKSignedurlStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
