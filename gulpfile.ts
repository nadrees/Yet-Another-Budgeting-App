import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { exec } from "child_process";
import path from "path";
import { series } from "gulp";

const graphqlDir = path.join(__dirname, "src", "graphql");
const emittedSchemaFile = path.join(
  __dirname,
  "__generated__",
  "schema.graphql"
);

export async function emitSchema(): Promise<void> {
  await buildSchema({
    resolvers: [path.join(graphqlDir, "**/*.ts")],
    emitSchemaFile: {
      path: emittedSchemaFile
    }
  });
}

export async function compileGraphQLTypes() {
  return exec("npm run compile");
}

exports.default = series(emitSchema, compileGraphQLTypes);
