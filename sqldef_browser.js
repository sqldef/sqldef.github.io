let source

/* global WebAssembly, fetch, Go,_SQLDEF */
window.sqldef = async (dbType, desiredDDLs, currentDDLs) => {
  if (WebAssembly) {
    source = source || (await (await fetch('sqldef.wasm')).arrayBuffer())
    const go = new Go()
    const result = await WebAssembly.instantiate(source, go.importObject)
    go.run(result.instance)
    return new Promise((resolve, reject) => {
      _SQLDEF(dbType, desiredDDLs, currentDDLs, (err, ret) => {
        if (err) {
          return reject(new Error(err))
        }
        resolve(ret)
      })
    })
  } else {
    throw new Error('WebAssembly is not supported in your browser')
  }
}
