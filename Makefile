sqldef.wasm: go.mod go.sum sqldef-wasm.go
	GOOS=js GOARCH=wasm go build $(GOFLAGS) -o sqldef.wasm ./sqldef-wasm.go
	cp $$(go env GOROOT)/lib/wasm/wasm_exec.js .

dev: sqldef.wasm
	@echo "Starting HTTP server at http://localhost:6543"
	@python3 -m http.server 6543
.PHONEY: devk

format:
	go fmt .
.PHONEY: format
