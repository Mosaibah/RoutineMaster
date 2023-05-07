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

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const serverless = require("serverless-http");
const { Pool } = require("pg");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
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
 * Select *
 **********************/
app.get("/home", async (req, res) => {
  const userId = req.query.userId; // Get the user's sub attribute from Cognito
  console.log(userId);
  const client = await pool.connect();

  // Select from SelectedTemplate by user if TODAY
  // FOUND : return templateId
  // select all inforamation from template teble and tasks

  // if not found, return all templates by user

  try {
    // Select from SelectedTemplate by user if TODAY
    const templateSelectResult = await client.query(
      'SELECT * FROM public."SelectedTemplate" WHERE "UserId" =$1 and "Date" = current_date',
      [userId]
    );
    const hasRecordToday = templateSelectResult.rows.length > 0;
    if (hasRecordToday) {
      const templateResult = await client.query(
        'SELECT * FROM public."Templates" WHERE "Id" = $1 ',
        [templateSelectResult.rows[0].TemplateId]
      );
      const currentTemplate = templateResult.rows[0];
      console.log(currentTemplate.Id);
      const tasksResult = await client.query(
        'SELECT h."Id", t."Name", t."Duration", h."Status", h."Remaining" FROM public."Tasks" t INNER JOIN public."TasksHistory" h ON t."Id" = h."TaskId" WHERE t."TemplateId" = $1',
        [currentTemplate.Id]
      );
      const tasks = tasksResult.rows;

      // Combine the template and tasks into a single object
      const result = {
        hasRecordToday: hasRecordToday,
        title: currentTemplate.Name,
        tasks: tasks.map((task) => ({
          id: task.Id,
          name: task.Name,
          duration: task.Duration,
          remaining: task.Remaining,
          status: task.Status,
        })),
      };

      res.json(result);
      // res.send({ hasRecordToday });
    } else {
      // select all inforamation from template teble and tasks
      // Query the templates table
      const templatesResult = await client.query(
        'SELECT "Id", "Name" FROM public."Templates" WHERE "UserId" = $1 order by "Id" desc',
        [userId]
      );
      const templates = templatesResult.rows;

      // Query the tasks table for each template
      const tasksPromises = templates.map((template) =>
        client.query(
          'SELECT "Id", "Name", "Duration" FROM public."Tasks" WHERE "TemplateId" = $1',
          [template.Id]
        )
      );

      const tasksResults = await Promise.all(tasksPromises);

      // Combine the templates and tasks
      const combinedResults = templates.map((template, index) => {
        const tasks = tasksResults[index].rows;
        return {
          hasRecordToday: hasRecordToday,
          id: template.Id,
          title: template.Name,
          tasks: tasks.map((task) => ({
            name: task.Name,
            duration: task.Duration,
          })),
        };
      });

      // Log the combinedResults instead of templates
      console.log(combinedResults);

      res.json(combinedResults);
      // res.send({ hasRecordToday });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  } finally {
    client.release();
  }
});

/**********************
 * Select *
 **********************/
app.post("/choose-template", async (req, res) => {
  const { templateId, userId } = req.body;
  console.log(userId);
  const client = await pool.connect();

  // get userId
  // get templateId
  // insert template, date, userId into SelectedTemplate

  try {
    // Insert the new template into the templates table
    const templateResult = await client.query(
      'INSERT INTO public."SelectedTemplate" ("UserId", "TemplateId", "Date") VALUES ($1, $2, current_date) RETURNING "Id"',
      [userId, templateId]
    );
    console.log(templateResult.rows[0]);
    const selectedTemplateId = templateResult.rows[0].Id;

    const templateTasks = await client.query(
      'SELECT * FROM public."Tasks" WHERE "TemplateId" = $1',
      [templateId]
    );

    const tasksHistoryData = templateTasks.rows
      .map((task) => `(${selectedTemplateId},${task.Id},${task.Duration})`)
      .join(",");

    // Perform bulk insert into TasksHistory
    const tasksHistoryResult = await client.query(
      `INSERT INTO public."TasksHistory" ("SelectedTemplateId", "TaskId", "Remaining") VALUES ${tasksHistoryData}`
    );

    // Get all tasks where templateId
    // insert to history with selectedId

    res.status(201).json({ message: "Template and tasks created on TODAY" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  } finally {
    client.release();
  }
});

/**********************
 * Select *
 **********************/
app.get("/countdown/:id", async (req, res) => {
  const historyId = req.params.id; 
  console.log(historyId);
  const client = await pool.connect();

  try {
    
    const tasksResult = await client.query(
      'SELECT h."Id", t."Name", t."Duration", h."Status", h."Remaining" FROM public."Tasks" t INNER JOIN public."TasksHistory" h ON t."Id" = h."TaskId" WHERE h."Id" = $1',
      [historyId]
    );

    res.json(tasksResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  } finally {
    client.release();
  }
});

// *********************

app.put("/countdown-update", async (req, res) => {
  const { TasksHistoryId, Remaining, Status } = req.body;

  if (!TasksHistoryId || Remaining === undefined || !Status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    const query = `
      UPDATE "TasksHistory"
      SET "Remaining" = $1, "Status" = $2
      WHERE "Id" = $3
      RETURNING *;
    `;

    const tasksResult = await client.query(query, [Remaining, Status, TasksHistoryId]);

    if (tasksResult.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(tasksResult.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "An error occurred while updating the task" });
  } finally {
    client.release();
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
