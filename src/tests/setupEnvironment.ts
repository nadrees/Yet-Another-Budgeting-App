export const USER_DATA_PATH = "test";

import "reflect-metadata";

import { getConnectionManager } from "typeorm";
import rimraf from "rimraf";

jest.mock("electron", () => ({
  app: { getPath: jest.fn().mockReturnValue(USER_DATA_PATH) }
}));

afterEach(async () => {
  // close any open connections
  await Promise.all(
    getConnectionManager()
      .connections.filter(connection => connection.isConnected)
      .map(async connection => await connection.close())
  );

  rimraf.sync(USER_DATA_PATH);
});
