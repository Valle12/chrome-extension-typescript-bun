#!/usr/bin/env node
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import moveTemplateSources from "./moveTemplateSources.js";
const dir = process.cwd();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const questions = [
  {
    name: "projectName",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
];

const answers = await inquirer.prompt(questions);
const projectName = answers["projectName"];
const templatePath = path.join(__dirname, "template");

moveTemplateSources(templatePath, dir, projectName);
