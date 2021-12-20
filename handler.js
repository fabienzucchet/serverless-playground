'use strict';

const AWS = require('aws-sdk');

module.exports = {
  status: async () => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Your website is healthy!',
          success: true,
          databaseTable: process.env.DYNAMODB_TABLE_NAME
        },
      ),
    };
  },

  create: async (event) => {

    const data = JSON.parse(event.body);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    try {
      await dynamodb.put(params).promise();
  
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(params.Item),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error: e.message }),
      };
    }

  },

  list: async () => {

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    try {
      const scanResults = await dynamodb.scan(params).promise();
  
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(scanResults.Items),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error: e.message }),
      };
    }
  }
};
