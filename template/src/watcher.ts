import { watch, readdir, rm } from "fs/promises";
import * as path from "path";

export class Watcher {
  dir = path.dirname(Bun.main);
  interval = 100;
  time = new Date().getTime();
  outdir = "dist";
  excludedFiles = ["index.ts", "watcher.ts"];

  constructor() {
    process.stdout.write("\x1Bc"); // Clears the Bun console
    this.buildAllTypescriptFiles();
    this.watch();
  }

  private async buildAllTypescriptFiles() {
    await rm(path.join(this.dir, this.outdir), { recursive: true });

    const dirContent = await readdir(this.dir, {
      recursive: true,
      withFileTypes: true,
    });

    const entrypoints = dirContent
      .filter(
        (file) =>
          file.isFile() &&
          !file.name.includes("node_modules") &&
          path.extname(file.name) === ".ts" &&
          !this.excludedFiles.includes(path.basename(file.name))
      )
      .map((file) => file.name);

    for (const entrypoint of entrypoints) {
      await Bun.build({
        entrypoints: [entrypoint],
        minify: true,
        outdir: path.join(this.dir, this.outdir, path.dirname(entrypoint)),
        sourcemap: "inline",
      });
    }
  }

  private async watch() {
    console.log("File watcher started...");
    const watcher = watch(this.dir, { recursive: true });

    for await (const event of watcher) {
      const now = new Date().getTime();
      if (now - this.time <= this.interval) continue;
      this.time = now;
      if (event.filename != null && path.extname(event.filename) === ".ts") {
        console.log(`Detected ${event.eventType} on ${event.filename}`);
        this.buildTypescriptFiles(event.filename);
      }
    }
  }

  private async buildTypescriptFiles(filename: string) {
    await Bun.build({
      entrypoints: [filename],
      minify: true,
      outdir: path.join(this.dir, this.outdir, path.dirname(filename)),
      sourcemap: "inline",
    });
  }
}
