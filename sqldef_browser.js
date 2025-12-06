var Go;
let SQLDEF = null;

const initializeWasm = async () => {
  if (SQLDEF) {
    return SQLDEF;
  }

  const response = await fetch("sqldef.wasm");
  const wasmBinary = await response.arrayBuffer();
  const go = new Go();
  const result = await WebAssembly.instantiate(wasmBinary, go.importObject);
  go.run(result.instance);
  SQLDEF = globalThis._SQLDEF;
  return SQLDEF;
};

globalThis.sqldef = async (dbType, desiredDDLs, currentDDLs) => {
  if (typeof WebAssembly !== "undefined") {
    const SQLDEF = await initializeWasm();

    return new Promise((resolve, reject) => {
      SQLDEF.diff(dbType, desiredDDLs, currentDDLs, (err, ret) => {
        if (err) {
          return reject(new Error(err));
        }
        resolve(ret);
      });
    });
  } else {
    throw new Error("WebAssembly is not supported in your browser");
  }
};
