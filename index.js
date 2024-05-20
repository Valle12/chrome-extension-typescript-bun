#!/usr/bin/env bun
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import moveTemplateSources from "./moveTemplateSources.js";

export default class Index {
  dir = process.cwd();
  __dirname = path.dirname(fileURLToPath(import.meta.url));

  questions = [
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

  constructor(initialAnswers = {}) {
    this.initialAnswers = initialAnswers;
  }

  async init() {
    let answers = await inquirer.prompt(this.questions, this.initialAnswers);
    let projectName = answers["projectName"];
    let templatePath = path.join(this.__dirname, "template");
    moveTemplateSources(templatePath, this.dir, projectName);
  }
}

export function run(fileURL, runURL) {
  console.log(fileURL, runURL);
  if (fileURL === runURL) {
    const index = new Index();
    index.init();
  }
}

run(import.meta.filename, process.argv[1]);
