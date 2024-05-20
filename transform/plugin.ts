import { plugin, type BunPlugin } from "bun";
import { Watcher } from "./src/watcher";
import ManifestParser from "./src/manifestParser";

const watchPlugin: BunPlugin = {
  name: "WatchPlugin",
  setup(build) {
    new ManifestParser();
    new Watcher();
  },
};

plugin(watchPlugin);
