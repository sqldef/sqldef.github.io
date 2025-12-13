# sqldef.github.io

Website and WebAssembly build of [sqldef](https://github.com/sqldef/sqldef) - an idempotent schema management tool for MySQL, PostgreSQL, SQLite3, and SQL Server.

## What is this?

This repository contains:
- A WASM build of sqldef's DDL diff functionality
- A web demo at https://sqldef.github.io/

## How it works

The Go source (`sqldef-wasm.go`) compiles to WebAssembly and exposes a `diff` function that compares two SQL schemas and generates migration DDLs.

## Development

```sh
# Build the WASM file
make

# Start local dev server at http://localhost:6543
make dev

# Update Go dependencies
make deps

# Format and lint
make format
make lint
```

## License

MIT

Copyright (c) sqldef team
