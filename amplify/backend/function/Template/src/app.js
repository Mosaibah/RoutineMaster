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
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
  ssl: {
    rejectUnauthorized: false,
  },
});


app.use(express.json());


/**********************
 * get method *
 **********************/
app.get('/templates', async (req, res) => {
  const userId = req.query.userId; // Get the user's sub attribute from Cognito
  console.log(userId);
  const client = await pool.connect();

  try {
    // Query the templates table
    const templatesResult = await client.query(
      'SELECT "Id", "Name" FROM public."Templates" WHERE "UserId" = $1 and "IsDelete" = false order by "Id" desc',
      [userId]
    );
    const templates = templatesResult.rows;

    // Query the tasks table for each template
    const tasksPromises = templates.map((template) =>
      client.query('SELECT "Id", "Name", "Duration" FROM public."Tasks" WHERE "TemplateId" = $1 and "IsDelete" = false ', [
        template.Id,
      ])
    );

    const tasksResults = await Promise.all(tasksPromises);

    // Combine the templates and tasks
    const combinedResults = templates.map((template, index) => {
      const tasks = tasksResults[index].rows;
      return {
        id: template.Id,
        title: template.Name,
        tasks: tasks.map((task) => ({ name: task.Name, duration: task.Duration })),
      };
    });

    // Log the combinedResults instead of templates
    console.log(combinedResults);

    res.json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    client.release();
  }
});

/****************************
*  get one method *
****************************/
app.get('/templates/:id', async (req, res) => {
  const id = req.params.id;
  const userId = req.query.userId; // Get the user's sub attribute from Cognito
  const client = await pool.connect();

  try {
    // Query the templates table for the template with the given ID
    const templateResult = await client.query(
      'SELECT * FROM public."Templates" WHERE "Id" = $1 and "UserId" =$2 ',
      [id, userId]
    );
    const template = templateResult.rows[0];
    if (template == undefined){
      res.status(500).json({ error: 'No template' });
    }
    // Query the tasks table for tasks belonging to this template
    const tasksResult = await client.query(
      'SELECT * FROM public."Tasks" WHERE "TemplateId" = $1 and "IsDelete" = false',
      [id]
    );
    const tasks = tasksResult.rows;

    // Combine the template and tasks into a single object
    const result = {
      title: template.Name,
      tasks: tasks.map(task => ({ 
        name: task.Name, 
        duration: task.Duration 
      })),
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    client.release();
  }
});




/****************************
*  post method *
****************************/

app.post('/templates', async (req, res) => {
  // console.log(req)
  // const userId = req.user.sub; // Get the user's sub attribute from Cognito
  const { Title, UserId, Tasks } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert the new template into the templates table
    const templateResult = await client.query(
      'INSERT INTO public."Templates" ("Name", "UserId") VALUES ($1, $2) RETURNING "Id"',
      [Title, UserId]
    );

    const templateId = templateResult.rows[0].Id;
  
    // Insert the tasks into the tasks table
    const tasksPromises = Tasks.map(([taskName, duration]) =>
      client.query(
        'INSERT INTO public."Tasks" ("Name", "Duration", "TemplateId") VALUES ($1, $2, $3)',
        [taskName, duration, templateId]
      )
    );

    await Promise.all(tasksPromises);

    await client.query('COMMIT');

    res.status(201).json({ message: 'Template and tasks created' });
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while creating data' });
  } finally {
    client.release();
  }
});

/****************************
* Example put method *
****************************/
app.put('/templates/:id', async (req, res) => {
  const id = req.params.id;
  const { Title, UserId, Tasks } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update the template in the templates table
    const templateResult = await client.query(
      'UPDATE public."Templates" SET "Name" = $1, "UserId" = $2 WHERE "Id" = $3 RETURNING "Id"',
      [Title, UserId, id]
    );

    const templateId = templateResult.rows[0].Id;

    // Delete existing tasks for this template
    await client.query('UPDATE public."Tasks" set "IsDelete" = true WHERE "TemplateId" = $1', [id]);

    // Insert the new tasks into the tasks table
    const tasksPromises = Tasks.map(([taskName, duration]) =>
      client.query(
        'INSERT INTO public."Tasks" ("Name", "Duration", "TemplateId") VALUES ($1, $2, $3)',
        [taskName, duration, templateId]
      )
    );

    await Promise.all(tasksPromises);

    await client.query('COMMIT');

    res.status(200).json({ message: 'Template and tasks updated' });
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while updating data' });
  } finally {
    client.release();
  }
});
/****************************
* Example delete method *
****************************/
// app.delete('/templates/:id', async (req, res) => {
//   const id = req.params.id;

//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     // Delete all tasks for the template
//     await client.query('DELETE FROM public."Tasks" WHERE "TemplateId" = $1', [id]);

//     // Delete the template
//     await client.query('DELETE FROM public."Templates" WHERE "Id" = $1', [id]);

//     await client.query('COMMIT');

//     res.status(200).json({ message: 'Template deleted' });
//   } catch (error) {
//     console.error(error);
//     await client.query('ROLLBACK');
//     res.status(500).json({ error: 'An error occurred while deleting data' });
//   } finally {
//     client.release();
//   }
// });

/****************************
* Example put method SOFT DELETE *
****************************/
app.put('/delete-template', async (req, res) => {
  const { id } = req.body;

  const client = await pool.connect();

  try {
    // Update the template in the templates table
    const templateResult = await client.query(
      'UPDATE public."Templates" SET "IsDelete" = true  WHERE "Id" = $1 ',
      [id]
    );

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting template' });
  } finally {
    client.release();
  }
})

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
