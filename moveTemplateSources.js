import * as fs from "fs";

const moveTemplateSources = (templatePath, newPath, projectName) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      // Rename
      if (file === ".npmignore") file = ".gitignore";

      const writePath = `${newPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${newPath}/${file}`);

      // recursive call
      moveTemplateSources(`${templatePath}/${file}`, `${newPath}/${file}`, "");
    }
  });
};

export default moveTemplateSources;
