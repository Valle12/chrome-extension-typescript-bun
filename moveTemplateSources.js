import * as fs from "fs";
import path from "path";

export default function moveTemplateSources(
  templatePath,
  newPath,
  projectName
) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(async (file) => {
    const originalFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(originalFilePath);

    if (stats.isFile()) {
      let contents = await Bun.file(originalFilePath).text();

      // Rename & Restructure
      if (file === ".npmignore") file = ".gitignore";
      if (file === "package.json" && projectName !== "") {
        let packageJson = JSON.parse(contents);
        packageJson["name"] = projectName;
        contents = JSON.stringify(packageJson, null, 2);
      }

      const writePath = path.join(newPath, file);
      await Bun.write(writePath, contents);
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
}
