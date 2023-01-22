import * as cdk from '@aws-cdk/core';
import { join } from 'path';
import { GraphqlApi, MappingTemplate, Schema } from '@aws-cdk/aws-appsync'
import { Table, BillingMode, AttributeType } from '@aws-cdk/aws-dynamodb'

export class AppsyncCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const DDBTable = new Table(this, 'MDDBTable', {
      partitionKey: {name:'PK', type: AttributeType.STRING},
      sortKey: {name: "SK", type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const AppSyncApi = new GraphqlApi(this, 'AppSyncApi', {
      name: 'SingleTableApiCDK',
      schema: Schema.fromAsset(join(__dirname, 'schema.graphql'))
    })

    const DDBDataSource = AppSyncApi.addDynamoDbDataSource("DDBDataSource", DDBTable)

    DDBDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getParentWithChildren',
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Query",
          "query" : {
            "expression": "PK = :pk",
            "expressionValues" : {
                ":pk" : $util.dynamodb.toDynamoDBJson($ctx.args.PK)
            }
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #set($children = [])
        #foreach($item in $ctx.result.items)
          #if($item['type'] == "parent")
            #set($PK = $item['PK'])
            #set($SK = $item['SK'])
            #set($data = $item['data'])
            #set($type = $item['type'])
          #end
          #if($item['type'] == "child")
            $util.qr($children.add($item))
          #end
        #end
        {
          "PK": "\${PK}",
            "SK": "\${SK}",
            "children": $utils.toJson($children),
            "data": "\${data}",
            "type": "\${type}"
        }
      `)
    })

    DDBDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createParentItem",
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2018-05-29",
          "operation": "PutItem",
          "key": {
            "PK": $util.dynamodb.toDynamoDBJson($ctx.args.PK),
            "SK": $util.dynamodb.toDynamoDBJson($ctx.args.SK)
          },
          "attributeValues": {
            "data": $util.dynamodb.toDynamoDBJson($ctx.args.data),
            "type": $util.dynamodb.toDynamoDBJson($ctx.args.type)
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString("$util.toJson($ctx.result)")
    })

    DDBDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createChildItem",
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version": "2018-05-29",
          "operation": "PutItem",
          "key": {
            "PK": $util.dynamodb.toDynamoDBJson($ctx.args.PK),
            "SK": $util.dynamodb.toDynamoDBJson($ctx.args.SK)
          },
          "attributeValues": {
            "data": $util.dynamodb.toDynamoDBJson($ctx.args.data),
            "type": $util.dynamodb.toDynamoDBJson($ctx.args.type)
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString("$util.toJson($ctx.result)")
    })
  }
}
