import "./wasm_exec.js";
const { Go } = globalThis; // defined in wasm_exec.js

if (typeof Go === "undefined") {
  throw new Error("Go is not initialized");
}

let SQLDEF = null;

const getInstance = async () => {
  if (SQLDEF) {
    return SQLDEF;
  }

  const response = await fetch("sqldef.wasm");
  const wasmBinary = await response.arrayBuffer();
  const go = new Go();
  const result = await WebAssembly.instantiate(wasmBinary, go.importObject);
  go.run(result.instance); // defines globalThis._SQLDEF
  SQLDEF = globalThis._SQLDEF;
  return SQLDEF;
};

export async function sqldef(dbType, desiredDDLs, currentDDLs, enableDrop = false) {
  if (typeof WebAssembly === "undefined") {
    throw new Error("WebAssembly is not supported in your browser");
  }

  const SQLDEF = await getInstance();

  return new Promise((resolve, reject) => {
    SQLDEF.diff(dbType, desiredDDLs, currentDDLs, enableDrop, (err, ret) => {
      if (err) {
        return reject(new Error(err));
      }
      resolve(ret);
    });
  });
}

export async function getVersion() {
  const SQLDEF = await getInstance();
  return SQLDEF.getVersion();
}

export async function getRevision() {
  const SQLDEF = await getInstance();
  return SQLDEF.getRevision();
}
