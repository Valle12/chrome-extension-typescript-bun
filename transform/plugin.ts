import { plugin, type BunPlugin } from "bun";
import { Watcher } from "./src/watcher";

const watchPlugin: BunPlugin = {
  name: "WatchPlugin",
  setup(build) {
    new Watcher();
  },
};

plugin(watchPlugin);
