module.exports = {
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupEnvironment.ts"]
};
