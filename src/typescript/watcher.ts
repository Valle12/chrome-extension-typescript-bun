import { watch, readdir, rm } from "fs/promises";
import * as path from "path";

export class Watcher {
  dir = path.dirname(Bun.main);
  interval = 100;
  time = new Date().getTime();

  constructor() {
    process.stdout.write("\x1Bc"); // Clears the Bun console
    this.buildAllTypescriptFiles();
    this.watch();
  }

  private async buildAllTypescriptFiles() {
    rm(path.join(this.dir, "dist"), { recursive: true });

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
          !file.name.includes("index.ts") &&
          !file.name.includes("watcher.ts")
      )
      .map((file) => file.name);

    for (const entrypoint of entrypoints) {
      await Bun.build({
        entrypoints: [entrypoint],
        minify: true,
        sourcemap: "inline",
        outdir: path.join(this.dir, "dist", path.dirname(entrypoint)),
      });
    }
  }

  private async watch() {
    const watcher = watch(this.dir, { recursive: true });
    for await (const event of watcher) {
      const now = new Date().getTime();
      if (now - this.time <= this.interval) continue;
      this.time = now;
      if (event.filename != null && path.extname(event.filename) === ".ts")
        this.buildTypescriptFiles(event.filename);
    }
  }

  private async buildTypescriptFiles(filename: string) {
    const build = await Bun.build({
      entrypoints: [filename],
      minify: true,
      outdir: path.join(this.dir, "dist", path.dirname(filename)),
      sourcemap: "inline",
    });
  }
}
