#!/usr/bin/env node
import inquirer from "inquirer";
import { lstat, mkdir } from "fs/promises";
import path from "path";
import moveTemplateSources from "./moveTemplateSources";

const workingDir = process.cwd();
let projectPath = null;

const questions = [
  {
    type: "input",
    name: "projectPath",
    message: "Project folder:",
    default: workingDir,
    async validate(value) {
      if (value.startsWith("./") || value.startsWith("../")) {
        projectPath = path.join(workingDir, value);
        return true;
      }
      const errorMessage = "You must provide a path to a valid directory";
      try {
        const result = await lstat(value);
        if (result.isDirectory()) return true;
        return errorMessage;
      } catch (e) {
        return errorMessage;
      }
    },
  },
  {
    type: "input",
    name: "projectName",
    message: "Project name:",
    validate(value) {
      if (!value || value.length == 0) return "You need to enter a name";
      return true;
    },
  },
];

const results = await inquirer.prompt(questions);

if (projectPath == null) {
  projectPath = results["projectPath"];
} else {
  await mkdir(projectPath, { recursive: true });
}

const projectName = results["projectName"];
moveTemplateSources(projectPath, projectName);
