import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import Index, { run } from "..";
import * as moveTemplateSourcesModule from "../moveTemplateSources";
import * as path from "path";
import { spawnSync } from "bun";

describe("index.js", () => {
  afterEach(() => {
    mock.restore();
  });

  test("succesful input", async () => {
    const moveTemplateSourcesSpy2 = spyOn(
      moveTemplateSourcesModule,
      "default"
    ).mockImplementation(() => {});
    const index = new Index({
      projectName: "cool",
    });
    await index.init();

    expect(moveTemplateSourcesSpy2).toHaveBeenCalledWith(
      path.join(import.meta.dir, "..", "template"),
      process.cwd(),
      "cool"
    );
  });

  test("validate good input", () => {
    const index = new Index();
    const validation = index.questions[0].validate("cool");
    expect(validation).toBe(true);
  });

  test("validate bad input", () => {
    const index = new Index();
    const validation = index.questions[0].validate("cool/project");
    expect(validation).toBe(
      "Project name may only include letters, numbers, underscores and hashes."
    );
  });

  test("launch from index.js causes start", () => {
    const initMock = spyOn(Index.prototype, "init").mockImplementation(() =>
      Promise.resolve()
    );
    run(
      path.join(process.cwd(), "index.js"),
      path.join(import.meta.dir, "..", "index.js")
    );
    expect(initMock).toHaveBeenCalledTimes(1);
  });

  test("launch from different file causes no direct start", () => {
    const initMock = spyOn(Index.prototype, "init").mockImplementation(() =>
      Promise.resolve()
    );
    const index = new Index();
    expect(initMock).toHaveBeenCalledTimes(0);
  });
});
