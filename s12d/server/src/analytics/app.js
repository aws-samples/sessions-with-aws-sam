const AWS = require('aws-sdk')
const doc = new AWS.DynamoDB.DocumentClient();
const table = process.env.TABLE_NAME;
const blockedList = ['app', '', null, undefined]

exports.handler = async (event) => {
  let updates = event.Records.map(record => {
    let dataString = Buffer.from(record.kinesis.data, "base64").toString("utf8");
    let dataStringArr = dataString.split("\t");
    let keyId = dataStringArr[3].replace(/\//, '')
    let country = dataStringArr[4].replace(/\n/, '')

    if (!blockedList.includes(keyId)) {
      return doc.update({
        TableName: table,
        Key: {
          id: keyId
        },
        UpdateExpression: `ADD #clicks :clicks, #regions.#country :clicks`,
        ConditionExpression: 'attribute_exists(id)',
        ExpressionAttributeNames: {
          '#clicks': 'clicks',
          '#regions': 'regions',
          '#country': country
        },
        ExpressionAttributeValues: {
          ':clicks': 1
        }
      }).promise()
    }
  })

  return Promise.all(updates).then(() => {
    return true
  }).catch(err => {
    if (err == 'ConditionalCheckFailedException: The conditional request failed') console.log(err);
    else throw err
  })
}