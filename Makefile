build: sqldef.wasm
.PHONY: build

sqldef.wasm: go.mod go.sum sqldef-wasm.go wasm_exec.js
	tinygo build -x -o sqldef.wasm -target=wasm ./sqldef-wasm.go

wasm_exec.js:
	cp $$(tinygo env TINYGOROOT)/targets/wasm_exec.js .

dev: sqldef.wasm
	@echo "Starting HTTP server at http://localhost:6543"
	@python3 -m http.server 6543
.PHONEY: dev

format:
	go fmt .
.PHONEY: format

deps:
	go get -u -t .
	go mod tidy
.PHONY: update

lint:
	GOOS=js GOARCH=wasm go vet .
.PHONY: lint

test: sqldef.wasm
	node --test test.mjs
.PHONY: test
