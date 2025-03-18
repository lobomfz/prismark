# DOCS WIP

## example usage
```prisma
generator prismark {
  provider    = "node ./dist/cli.js"
  output      = "./generated"
  fileName    = "schema.ts"
  enumSuffix  = "_literal"
  plainSuffix = "_plain"
  nullish     = true
}
```