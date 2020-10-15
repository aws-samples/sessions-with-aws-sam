const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const moment = require('moment');
const numeral = require('numeral')
let response;

exports.lambdaHandler = async (event, context) => {
    try {
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Hi everyone!',
                sdkVersion: AWS.VERSION,
                location: ret.data.trim(),
                today: moment().format('MMMM Do YYYY, h:mm:ss a'),
                funNumber: numeral(1230974).format('($ 0.00 a)')
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
