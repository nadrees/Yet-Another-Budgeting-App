import "reflect-metadata";
import "typeface-roboto";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CssBaseline, ThemeProvider, createMuiTheme } from "@material-ui/core";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import App from "./App";
import { ipcRenderer } from "electron";

ipcRenderer.invoke("get-graphql-uri").then(uri => {
  const client = new ApolloClient({ uri });

  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  const Index = () => {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    );
  };

  const render = () =>
    ReactDOM.render(<Index />, document.getElementById("app"));

  if (module.hot) {
    module.hot.accept(render);
  }

  render();
});
