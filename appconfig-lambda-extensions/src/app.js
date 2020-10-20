// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
// //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict'
const fetch = require('node-fetch')
let message

async function getConfig () {
  try {
    const url = 'http://localhost:2772/applications/' + process.env.APPCONFIG_APPLICATION + '/environments/' + process.env.APPCONFIG_ENVIRONMENT + '/configurations/' + process.env.APPCONFIG_CONFIGURATION
    const response = await fetch(url)
    const json = await response.json()
    return json
  } catch (err) {
    console.error(err)
    throw err
  }
}

exports.handler = async (event) => {
  const options =  await getConfig()
  if (options.isEnabled === true) {
    message = 'Hello from ' + options.messageOption + '!'
  } else {
    message = 'Hello from Lambda!'
  }
  const response = {
      statusCode: 200,
      body: JSON.stringify(message),
  };
  return response;
};
