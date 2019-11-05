.PHONY: wasm

wasm:
	GOOS=js GOARCH=wasm go build $(GOFLAGS) -o sqldef.wasm ./sqldef-wasm.go
	cp ${GOROOT}/misc/wasm/wasm_exec.js .
