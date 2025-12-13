//go:build js

// This is a light wasm wrapper around just the DDL conversion stuff
package main

import (
	"fmt"
	"strings"
	"syscall/js"

	"github.com/sqldef/sqldef/v3"
	"github.com/sqldef/sqldef/v3/database"
	"github.com/sqldef/sqldef/v3/parser"
	"github.com/sqldef/sqldef/v3/schema"
)

// sqldefDiff (mode: string, desiredDDLs: string, currentDDLs: string, enableDrop: bool, callback: (err: string | null, result: string | null) -> void) -> bool
func sqldefDiff(this js.Value, args []js.Value) any {
	if len(args) != 5 {
		panic(fmt.Sprintf("expected 5 arguments, got %d", len(args)))
	}

	mode := args[0].String()
	desiredDDLs := args[1].String()
	currentDDLs := args[2].String()
	enableDrop := args[3].Bool()
	callback := args[4]

	generatorMode := schema.GeneratorModeMysql
	parserMode := parser.ParserModeMysql
	switch mode {
	case "postgres":
		generatorMode = schema.GeneratorModePostgres
		parserMode = parser.ParserModePostgres
	case "mysql":
		generatorMode = schema.GeneratorModeMysql
		parserMode = parser.ParserModeMysql
	case "sqlite3":
		generatorMode = schema.GeneratorModeSQLite3
		parserMode = parser.ParserModeSQLite3
	case "mssql":
		generatorMode = schema.GeneratorModeMssql
		parserMode = parser.ParserModeMssql
	default:
		callback.Invoke(fmt.Errorf("unsupported database type: %s", mode), nil)
		return false
	}

	sqlParser := database.NewParser(parserMode)
	config := database.GeneratorConfig{
		EnableDrop:         enableDrop,
		LegacyIgnoreQuotes: false,
	}
	defaultSchema := ""

	ddls, err := schema.GenerateIdempotentDDLs(generatorMode, sqlParser, desiredDDLs, currentDDLs, config, defaultSchema)
	out := strings.Join(ddls, ";\n")

	if err != nil {
		callback.Invoke(err.Error(), out)
		return false
	} else {
		callback.Invoke(nil, out)
		return true
	}
}

// sqldefGetFullVersion () -> string
func sqldefGetFullVersion(this js.Value, args []js.Value) any {
	return sqldef.GetFullVersion()
}

func main() {
	c := make(chan bool)

	exports := map[string]any{
		"diff": js.FuncOf(sqldefDiff),
		"getFullVersion": js.FuncOf(sqldefGetFullVersion),
	}
	js.Global().Set("_SQLDEF", js.ValueOf(exports))

	<-c // block forever
}
