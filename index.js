#!/usr/bin/env bun
import inquirer from "inquirer";
import * as path from "path";
import { lstat, mkdir } from "fs/promises";

const workingDir = process.cwd();

const questions = [
  {
    type: "input",
    name: "path",
    message: "Project folder:",
    default: workingDir,
    async validate(value) {
      if (value.startsWith("./") || value.startsWith("../")) {
        const dir = path.join(workingDir, value);
        await mkdir(dir, { recursive: true });
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
];

const results = await inquirer.prompt(questions);
console.log(results);
