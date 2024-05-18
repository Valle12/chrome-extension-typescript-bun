/// <reference types="chrome"/>

export type ContentScriptOmitted = Omit<
  NonNullable<chrome.runtime.ManifestV3["content_scripts"]>[0],
  "run_at"
>;

export type ContentScript = ContentScriptOmitted & {
  run_at?: "document_start" | "document_end" | "document_idle";
};

export type KnownProperties<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : K]: T[K];
};

export type ManifestCopy = KnownProperties<chrome.runtime.ManifestV3>;

export type ManifestReadOmitted = Omit<
  ManifestCopy,
  "content_scripts" | "manifest_version" | "version"
>;

export type ManifestRead = ManifestReadOmitted & {
  content_scripts?: ContentScript[];
};

export type ManifestWrite = ManifestRead & {
  manifest_version: 3;
  version: string;
};
