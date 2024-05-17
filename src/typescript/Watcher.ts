import { watch } from "fs/promises";
import * as path from "path";

export class Watcher {
  dir = path.dirname(Bun.main);
  interval = 100;
  time = new Date().getTime();

  constructor() {
    this.watch();
  }

  private async watch() {
    const watcher = watch(this.dir, { recursive: true });
    for await (const event of watcher) {
      const now = new Date().getTime();
      if (now - this.time <= this.interval) continue;
      this.time = now;
      process.stdout.write("\x1Bc"); // Clears the Bun console
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
