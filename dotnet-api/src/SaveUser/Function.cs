using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.LambdaJsonSerializer))]

namespace Function
{
    public class Function
    {
        public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayHttpApiV2ProxyRequest eventTrigger)
        {
            Console.WriteLine(JsonSerializer.Serialize(eventTrigger));

            var body = eventTrigger.Body;
            if (eventTrigger.IsBase64Encoded) {
                body = Encoding.UTF8.GetString(Convert.FromBase64String(body));
            }
            
            // Add "id" from path parameters to JSON body
            var data = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(body);
            data["id"] = eventTrigger.PathParameters["id"];
            var dataJSON = JsonSerializer.Serialize(data);

            var client = new AmazonDynamoDBClient();
            var table = Table.LoadTable(client, Environment.GetEnvironmentVariable("TABLE_NAME"));

            await table.PutItemAsync(Document.FromJson(dataJSON));

            return new APIGatewayHttpApiV2ProxyResponse
            {
                StatusCode = 204
            };
        }
    }
}
