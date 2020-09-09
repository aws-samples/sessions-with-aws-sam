const aws = require('aws-sdk');
const config = new aws.ConfigService();



// If full configuration is in invoking event, it is returned. If not thenwe need to call config for the whole thing
async function getConfigurationItem(invokingEvent) {
  let configurationItem = invokingEvent.configurationItem;
  if (invokingEvent.messageType === 'OversizedConfigurationItemChangeNotification') {
    let configItemSum = invokingEvent.configurationItemSummary
    try {
      let apiConfigurationItem = await getConfiguration(configItemSum.resourceType, configItemSum.resourceId, configItemSum.configurationItemCaptureTime)
      configurationItem = convertApiConfiguration(apiConfigurationItem.configurationItems[0])
    } catch (err) {
      return errorHandler(err)
    }
  }
  return configurationItem;
}

// Gets full configuration from the config service
async function getConfiguration(resourceType, resourceId, configurationCaptureTime) {
  let params = {
    resourceType,
    resourceId,
    laterTime: new Date(configurationCaptureTime),
    limit: 1
  }
  return config.getResourceConfigHistory(params).promise()
}

// Utility for converting fetched config to proper config format
function convertApiConfiguration(apiConfiguration) {
  apiConfiguration.awsAccountId = apiConfiguration.accountId;
  apiConfiguration.ARN = apiConfiguration.arn;
  apiConfiguration.configurationStateMd5Hash = apiConfiguration.configurationItemMD5Hash;
  apiConfiguration.configurationItemVersion = apiConfiguration.version;
  apiConfiguration.configuration = JSON.parse(apiConfiguration.configuration);
  if ({}.hasOwnProperty.call(apiConfiguration, 'relationships')) {
    for (let i = 0; i < apiConfiguration.relationships.length; i++) {
      apiConfiguration.relationships[i].name = apiConfiguration.relationships[i].relationshipName;
    }
  }
  return apiConfiguration;
}

// Verifies applicability of compliance
function isApplicable(configurationItem, event) {
  const status = configurationItem.configurationItemStatus;
  const eventLeftScope = event.eventLeftScope;
  return (status === 'OK' || status === 'ResourceDiscovered') && eventLeftScope === false;
}

// Utility to resolve path against JSON
function resolve(path, obj = self, separator = '.') {
  var properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

// Compliance check
function evaluateCompliance(configurationItem, ruleParameters) {
  // Checks for proper resource type
  if (!ruleParameters.resourceTypesArray.includes(configurationItem.resourceType)) {
    return 'NOT_APPLICABLE';
  // Checks for matching path and allowed values
  } else if (ruleParameters.acceptedValues.includes(resolve(ruleParameters.keyPath, configurationItem.configuration))) {
    return 'COMPLIANT';
  }
  return 'NON_COMPLIANT';
}

// Function to handle errors
function errorHandler(err) {
  console.log(err.message);
  return err;
}


exports.handler = async (event) => {
  
  // Get invoking event from config event
  const invokingEvent = JSON.parse(event.invokingEvent);
  
  // Get rule parameters from event
  const ruleParameters = JSON.parse(event.ruleParameters);
  
  // Set initial variables
  let configurationItem = {};
  let putEvaluationsRequest = {};
  let putEvaluationResults = {};
  let compliance = 'NOT_APPLICABLE';
  
  // Get full configuration if needed
  try {
    configurationItem = await getConfigurationItem(invokingEvent)
  } catch (err) {
    return errorHandler(err);
  }

  // If applicable, check for compliance
  if (isApplicable(configurationItem, event)) {
    // actual compliance check ####
    compliance = evaluateCompliance(configurationItem, ruleParameters)
    console.log(JSON.stringify(compliance))
  }
  
  // Build evaluation request to config
  putEvaluationsRequest.Evaluations = [{
    ComplianceResourceType: configurationItem.resourceType,
    ComplianceResourceId: configurationItem.resourceId,
    ComplianceType: compliance,
    OrderingTimestamp: configurationItem.configurationItemCaptureTime,
  }];
  putEvaluationsRequest.ResultToken = event.resultToken;

  // Call Config service to put evaluation results
  try{
    putEvaluationResults = await config.putEvaluations(putEvaluationsRequest).promise()
  } catch (err) {
    return errorHandler(err);
  }
  return {resource: configurationItem.resourceId, compliance: compliance, reportResults: putEvaluationResults}
}