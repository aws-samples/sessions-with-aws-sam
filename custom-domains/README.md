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

# Custom domains
These templates show different ways to create custom domains for HTTP API and REST API. If a ZoneID is passed in then the recordset is created in the existing zone. If not, then a new Zone is created with the record set in it. If the CERT ARN is passed in then that certificate will be used. If not, then a new cert is created.

## Deployment
use `sam deploy -g` in each folder to get started.

## Cert verification
If a cert arn is NOT passed in, then during the creation of the **GeneratedCert** you will be asked to create a CNAME record in the route 53 zone. Watch for *Content of DNS Record is* It will then continue on with the deploy after the DNS has been verified.

## Types
### HTTP
Builds a custom domain and points it to the root of an HTTP API

### REST
Builds a custom domain and points it to the root of an REST API

### both-declared
Builds a custom domain and the custom domain mappings for an HTTP API and a REST API declaratively.

### both-implied
Creates a custom domain for an HTTP API via the domain property on the HTTP API. It then creates an API mapping for a REST API for the same custom domain.