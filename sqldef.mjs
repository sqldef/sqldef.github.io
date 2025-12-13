import "./wasm_exec.js";
const { Go } = globalThis; // defined in wasm_exec.js

if (typeof Go === "undefined") {
  throw new Error("Go is not initialized");
}

let SQLDEF = null;
let isLoading = false;

function formatMs(ms) {
  return ms.toFixed(4).replace(/\.?0+$/, "");
}

async function getInstance() {
  while (isLoading) {
    await new Promise((resolve) => setTimeout(resolve));
  }

  if (SQLDEF) {
    return SQLDEF;
  }

  isLoading = true;
  try {
    const t0 = performance.now();
    const response = await fetch("sqldef.wasm");
    const t1 = performance.now();
    const wasmBinary = await response.arrayBuffer();
    const t2 = performance.now();
    const go = new Go();
    const result = await WebAssembly.instantiate(wasmBinary, go.importObject);
    go.run(result.instance); // defines globalThis._SQLDEF
    const t3 = performance.now();

    console.debug(
      `sqldef.wasm loading time: fetch: ${formatMs(
        t1 - t0
      )}ms, instantiate: ${formatMs(t2 - t1)}ms, start: ${formatMs(t3 - t2)}ms`
    );

    SQLDEF = globalThis._SQLDEF;
  } finally {
    isLoading = false;
  }

  return SQLDEF;
}

export async function sqldef(
  dbType,
  desiredDDLs,
  currentDDLs,
  enableDrop = false
) {
  if (typeof WebAssembly === "undefined") {
    throw new Error("WebAssembly is not supported in your browser");
  }

  const sqldef = await getInstance();

  return new Promise((resolve, reject) => {
    sqldef.diff(dbType, desiredDDLs, currentDDLs, enableDrop, (err, ret) => {
      if (err) {
        return reject(new Error(err));
      }
      resolve(ret);
    });
  });
}

export async function getFullVersion() {
  const sqldef = await getInstance();
  return sqldef.getFullVersion();
}
