import "reflect-metadata";

import { BrowserWindow, app, ipcMain } from "electron";

import { BudgetFileResolver } from "./graphql/resolvers/BudgetFileResolver";
import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const PORT = process.env.PORT || 8888;
const GRAPHQL_ROUTE = "graphql";

const appName = "YABA";
app.name = appName;
const appData = app.getPath("appData");
app.setPath("userData", path.join(appData, appName));

let mainWindow: BrowserWindow | null;
let playground: BrowserWindow | null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once("ready-to-show", () => {
    mainWindow?.maximize();
    mainWindow?.show();
    if (!app.isPackaged) {
      mainWindow?.webContents?.openDevTools();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (!app.isPackaged) {
    playground = new BrowserWindow({ show: false });
    playground.loadURL(`http://localhost:${PORT}/playground`);

    playground.once("ready-to-show", () => {
      playground?.maximize();
      playground?.show();
    });

    playground.on("closed", () => {
      playground = null;
    });
  }
};

async function bootstrap() {
  const schema = await buildSchema({ resolvers: [BudgetFileResolver] });

  const server = new GraphQLServer({
    schema
  });
  server.start(
    {
      endpoint: `/${GRAPHQL_ROUTE}`,
      playground: app.isPackaged ? false : "/playground",
      port: PORT
    },
    createWindow
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", bootstrap);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle("get-graphql-uri", () => {
  return `http://localhost:${PORT}/${GRAPHQL_ROUTE}`;
});
