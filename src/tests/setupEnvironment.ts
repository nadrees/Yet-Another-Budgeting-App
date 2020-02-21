export const USER_DATA_PATH = "test";

import "reflect-metadata";

import rimraf from "rimraf";

jest.mock("electron", () => ({
  app: { getPath: jest.fn().mockReturnValue(USER_DATA_PATH) }
}));

afterEach(() => {
  rimraf.sync(USER_DATA_PATH);
});
