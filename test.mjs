import { test } from "node:test";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock fetch for Node.js to load local wasm file
globalThis.fetch = async (url) => {
  const filePath = join(__dirname, url);
  const buffer = await readFile(filePath);
  return {
    arrayBuffer: async () => buffer.buffer,
  };
};

// Now import the modules
const { sqldef } = await import("./sqldef.mjs");
const { schemaExamples } = await import("./schema_examples.mjs");

for (const [dbType, example] of Object.entries(schemaExamples)) {
  test(`sqldef returns non-empty string for ${dbType} (enableDrop=false)`, async () => {
    const result = await sqldef(dbType, example.desired, example.current, false);
    assert.strictEqual(typeof result, "string");
    assert.ok(result.length > 0, `Result should be non-empty for ${dbType}`);
  });

  test(`sqldef returns non-empty string for ${dbType} (enableDrop=true)`, async () => {
    const result = await sqldef(dbType, example.desired, example.current, true);
    assert.strictEqual(typeof result, "string");
    assert.ok(result.length > 0, `Result should be non-empty for ${dbType}`);
  });
}
