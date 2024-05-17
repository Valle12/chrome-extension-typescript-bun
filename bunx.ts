#!/usr/bin/env bun
import inquirer, { type Answers, type QuestionCollection } from "inquirer";
import * as path from "path";
import { lstat, mkdir } from "fs/promises";

const workingDir = process.cwd();

const questions: QuestionCollection<Answers>[] = [
  {
    type: "input",
    name: "path",
    message: "Project folder:",
    default: workingDir,
    async validate(value: string) {
      if (value.startsWith("./") || value.startsWith("../")) {
        const dir = path.join(workingDir, value);
        await mkdir(dir, { recursive: true });
        return true;
      }

      try {
        const result = await lstat(value);
        if (result.isDirectory()) return true;
        return "You must provide a path to a valid directory";
      } catch (e) {
        return "You must provide a path to a valid directory";
      }
    },
  },
];

const results = await inquirer.prompt(questions);
console.log(results);
