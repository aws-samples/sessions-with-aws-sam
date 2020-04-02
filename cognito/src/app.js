exports.lambdaHandler = async (event, context, callback) => {
  let newScopes = event.request.groupConfiguration.groupsToOverride.map(item => `${item}-${event.callerContext.clientId}`)

  event.response = {
    "claimsOverrideDetails": {
      "claimsToAddOrOverride": {
        "scope": newScopes.join(" "),
      }
    }
  };

  callback(null, event)
}