# YABA (Yet Another Budgeting App)

## First Time Setup

- `npm install gulp-cli -g`

## Libraries Used

- Electron (https://www.electronjs.org/)
- TypeGraphQL (https://typegraphql.ml/)
- MaterialUI (https://material-ui.com/)

## Recommended VS Code Extensions

- Apollo GraphQL
- Prettier
- sort-imports
- vscode-icons

## Development Scripts

### Electron Forge

Electron Forge handles building our app automatically. Run `npm start` to start the
build process and launch the app.

### Updating GraphQL types

The graphql schema is output to `__generated__/schema.graphql`, and is used
by apollo to be able to validate queries, mutations, and subscriptions statically.
Whenever making a change to types, resolvers on the main thread, or any usage of
graphql on the renderer, run `gulp` to sync the schema and typescript types.
