# Prisma to Arktype generator

## Usage
```prisma
generator prismark {
  provider    = "npx prismark"

  output      = "./generated"
  fileName    = "schema.ts"
  
  enumSuffix  = "_literal"
  plainSuffix = "_plain"
  
  // if the field should be optional
  nullish     = true
}


// Example schema
enum role {
  admin
  moderator
}

model users {
  id String @id @default(uuid())

  type role

  // VarChar max length is respected
  name String @db.VarChar(50)

  created_at DateTime @default(now())
}
```

## Generate
Run the Prisma generator after configuring your `schema.prisma`:
```bash
bun prisma generate
```

## Example output
```typescript
import { type } from "arktype";

export const role_literal = type.enumerated("admin", "moderator");

export const users_plain = type({
	id: "string",
	type: role_literal,
	name: "string < 50",
	created_at: "Date",
});
```