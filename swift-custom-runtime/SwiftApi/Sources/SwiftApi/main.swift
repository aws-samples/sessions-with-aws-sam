import AWSLambdaEvents
import AWSLambdaRuntime
import NIO

// MARK: - Run Lambda
Lambda.run(APIGatewayProxyLambda())

// MARK: - Handler, Request and Response
// FIXME: Use proper Event abstractions once added to AWSLambdaRuntime
struct APIGatewayProxyLambda: EventLoopLambdaHandler {
    public typealias In = APIGateway.V2.Request
    public typealias Out = APIGateway.V2.Response

    public func handle(context: Lambda.Context, event: APIGateway.V2.Request) -> EventLoopFuture<APIGateway.V2.Response> {
        context.logger.debug("hello, api gateway!")
        return context.eventLoop.makeSucceededFuture(APIGateway.V2.Response(statusCode: .ok, body: "Hello from the Swift powered Amazon API Gateway, HTTP API! Built, packaged, and deployed with AWS SAM!"))
    }
}