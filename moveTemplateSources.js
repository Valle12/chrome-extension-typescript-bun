import * as fs from "fs";
import path from "path";

const moveTemplateSources = (templatePath, newPath, projectName) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, "utf8");

      // Rename
      if (file === ".npmignore") file = ".gitignore";
      if (file === "package.json" && projectName !== "") {
        let packageJson = JSON.parse(contents);
        packageJson["name"] = projectName;
        contents = JSON.stringify(packageJson, null, 2);
      }

      const writePath = path.join(newPath, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(newPath, file));

      // recursive call
      moveTemplateSources(
        path.join(templatePath, file),
        path.join(newPath, file),
        ""
      );
    }
  });
};

export default moveTemplateSources;
