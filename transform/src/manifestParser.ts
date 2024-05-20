import packageJson from "../../package.json";
import type { ManifestWrite } from "./types";
import { rm } from "fs/promises";
const { manifestRead } = await import(Bun.env.MANIFEST);
const { version } = packageJson;

export default class ManifestParser {
  entrypoints: string[] = [];

  constructor() {
    this.init();
  }

  async init() {
    this.clearDistFolder();

    let manifestWrite = manifestRead as ManifestWrite;
    this.addAttributes(manifestWrite);
    this.parseBackground(manifestWrite);
    this.parseContentScripts(manifestWrite);
    this.build();

    await Bun.write(
      "dist/manifest.json",
      JSON.stringify(manifestWrite, null, 2)
    );
  }

  addAttributes(manifest: ManifestWrite) {
    manifest.manifest_version = 3;
    manifest.version = version;

    /*let contentScript: ContentScript = {
      matches: ["<all_urls>"],
      js: ["src/reloader.ts"],
    };
    if (manifest.content_scripts == undefined) manifest.content_scripts = [];
    manifest.content_scripts.push(contentScript);*/
  }

  async parseBackground(manifest: ManifestWrite) {
    if (manifest.background == undefined) return;
    this.entrypoints.push(manifest.background.service_worker);
    manifest.background.service_worker =
      manifest.background.service_worker.replace(".ts", ".js");
  }

  async parseContentScripts(manifest: ManifestWrite) {
    if (manifest.content_scripts == undefined) return;
    for (let content_script of manifest.content_scripts) {
      if (content_script.js == undefined) continue;
      this.entrypoints.push(...content_script.js);
      content_script.js = content_script.js.map(ele =>
        ele.replace(".ts", ".js")
      );
    }
  }

  async build() {
    if (this.entrypoints.length == 0) return;
    let build = await Bun.build({
      entrypoints: this.entrypoints,
      minify: true,
      outdir: "dist/src",
      sourcemap: "external",
    });

    console.log(build);
  }

  async clearDistFolder() {
    await rm("dist", {
      recursive: true,
      force: true,
    });
  }
}
