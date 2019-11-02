.PHONY: wasm

wasm:
	GOOS=js GOARCH=wasm go build $(GOFLAGS) -o web/sqldef.wasm ./web/sqldef-wasm.go
	cp ${GOROOT}/misc/wasm/wasm_exec.js web
