import { BudgetFileResolver, getDbFolder } from "../BudgetFileResolver";

import { USER_DATA_PATH } from "../../../tests/setupEnvironment";
import fs from "fs";
import path from "path";
import util from "util";

const EXPECTED_BUDGET_FOLDER_PATH = path.join(USER_DATA_PATH, "budgets");

const existsSpy = jest.spyOn(fs, "exists");

describe("BudgetFileResolver", () => {
  describe("budgetFiles", () => {
    it("should form the correct db folder path", async () => {
      const resolver = new BudgetFileResolver();
      await resolver.budgetFiles();

      expect(existsSpy).toHaveBeenCalledWith(
        EXPECTED_BUDGET_FOLDER_PATH,
        expect.any(Function)
      );
    });

    it("should create the folder if it does not exist", async () => {
      const resolver = new BudgetFileResolver();
      await resolver.budgetFiles();

      const exists = fs.existsSync(EXPECTED_BUDGET_FOLDER_PATH);
      expect(exists).toBeTruthy();
    });

    describe("should return the correct set of file", () => {
      const resolver = new BudgetFileResolver();

      test("when there are no files", async () => {
        const files = await resolver.budgetFiles();
        expect(files.length).toBe(0);
      });

      test("when files exist", async () => {
        await Promise.all([
          await resolver.createBudget({ name: "Test1" }),
          await resolver.createBudget({ name: "Test2" })
        ]);

        const files = await resolver.budgetFiles();

        expect(files.length).toBe(2);
      });

      test("when non-yaba files exist in the folder", async () => {
        const dbFolder = await getDbFolder();

        await Promise.all([
          await resolver.createBudget({ name: "Test1" }),
          await resolver.createBudget({ name: "Test2" }),
          await util.promisify(fs.writeFile)(
            path.join(dbFolder, "test.txt"),
            "test"
          )
        ]);

        const files = await resolver.budgetFiles();

        expect(files.length).toBe(2);
      });
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
