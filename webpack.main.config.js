const rules = require("./webpack.rules");

rules.push({
  test: /\.mjs$/,
  include: /node_modules/,
  type: "javascript/auto"
});

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  externals: {
    typeorm: "commonjs typeorm"
  },
  module: {
    rules: rules
  },
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".css", ".json"]
  }
};
