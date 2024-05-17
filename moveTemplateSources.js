import * as fs from "fs";
import path from "path";

const dir = process.cwd();
const templatePath = path.join(dir, "template");

const moveTemplateSources = (projectPath, projectName) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      // Rename
      if (file === ".npmignore") file = ".gitignore";

      const writePath = path.join(projectPath, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(projectPath, path.basename(file)));

      // recursive call
      moveTemplateSources(
        path.join(templatePath, file),
        path.join(projectPath, file)
      );
    }
  });
};

export default moveTemplateSources;
