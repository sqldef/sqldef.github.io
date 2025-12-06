// +build js
// This is a light wasm wraper around just the DDL conversion stuff
package main

import (
  "strings"
  "syscall/js"
  "github.com/sqldef/sqldef/v3/database"
  "github.com/sqldef/sqldef/v3/parser"
  "github.com/sqldef/sqldef/v3/schema"
)

func diff(this js.Value, args []js.Value) interface {} {
  mode := args[0].String()
  desiredDDLs := args[1].String()
  currentDDLs := args[2].String()
  callback := args[3]

  generatorMode := schema.GeneratorModeMysql
  parserMode := parser.ParserModeMysql
  if (mode == "postgres"){
    generatorMode = schema.GeneratorModePostgres
    parserMode = parser.ParserModePostgres
  }

  sqlParser := database.NewParser(parserMode)
  config := database.GeneratorConfig{}
  defaultSchema := ""

  ddls, err := schema.GenerateIdempotentDDLs(generatorMode, sqlParser, desiredDDLs, currentDDLs, config, defaultSchema)
  out := strings.Join(ddls, ";\n")

  if err != nil {
    callback.Invoke(err.Error(), out)
    return false
  } else {
    callback.Invoke(js.Null(), out)
    return true
  }
}

func main() {
  c := make(chan bool)
  // I wish this wasn't global!
  js.Global().Set("_SQLDEF", js.FuncOf(diff))
  <-c
}
