/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	host
	user
	password
	database
	port
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const serverless = require('serverless-http');
const { Pool } = require('pg');


// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});


app.use(express.json());


/**********************
 * Example get method *
 **********************/

app.get('/templates', async (req, res) => {
  const userId = req.user.sub; // Get the user's sub attribute from Cognito

  const client = await pool.connect();

  try {
    // Query the templates table
    const templatesResult = await client.query(
      'SELECT Id, Name FROM Templates WHERE UserId = $1',
      [userId]
    );
    const templates = templatesResult.rows;

    // Query the tasks table for each template
    const tasksPromises = templates.map((template) =>
      client.query('SELECT Id, Duration FROM Tasks WHERE TemplateId = $1', [
        template.id,
      ])
    );

    const tasksResults = await Promise.all(tasksPromises);

    // Combine the templates and tasks
    const combinedResults = templates.map((template, index) => {
      const tasks = tasksResults[index].rows;
      return {
        templateName: template.name,
        tasks: tasks.map((task) => [task.id, task.duration]),
      };
    });

    res.json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    client.release();
  }
});

/****************************
* Example post method *
****************************/

app.post('/templates', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/templates/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/templates', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/templates/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/templates', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/templates/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
