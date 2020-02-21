import { BudgetFileResolver, getDbFolder } from "../BudgetFileResolver";

import { Budget } from "../../../db/entity/Budget";
import { USER_DATA_PATH } from "../../../tests/setupEnvironment";
import fs from "fs";
import { getRepository } from "typeorm";
import { initConnect } from "../../../db/ConnectionUtils";
import path from "path";
import util from "util";

const EXPECTED_BUDGET_FOLDER_PATH = path.join(USER_DATA_PATH, "budgets");

const existsSpy = jest.spyOn(fs, "exists");

describe("BudgetFileResolver", () => {
  let resolver: BudgetFileResolver;

  beforeEach(() => {
    resolver = new BudgetFileResolver();
  });

  describe("budgetFiles", () => {
    it("should form the correct db folder path", async () => {
      await resolver.budgetFiles();

      expect(existsSpy).toHaveBeenCalledWith(
        EXPECTED_BUDGET_FOLDER_PATH,
        expect.any(Function)
      );
    });

    it("should create the folder if it does not exist", async () => {
      await resolver.budgetFiles();

      const exists = fs.existsSync(EXPECTED_BUDGET_FOLDER_PATH);
      expect(exists).toBeTruthy();
    });

    describe("should return the correct set of file", () => {
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

  describe("createBudget", () => {
    describe("when creating a new budget", () => {
      it("should create a new .yaba file", async () => {
        const result = await resolver.createBudget({ name: "test" });
        expect(result.budgetFile?.path).not.toBeNull();
        expect(result.budgetFile?.path).toContain("test");
      });

      it("should sanitize the file name", async () => {
        const result = await resolver.createBudget({ name: "test!?&*" });
        expect(result.budgetFile?.path).not.toBeNull();
        expect(result.budgetFile?.path).toContain("test");
      });

      it("should insert the budget name in to the db", async () => {
        const result = await resolver.createBudget({ name: "test" });
        expect(result.budgetFile?.path).not.toBeNull();

        await initConnect(result.budgetFile?.path ?? "");

        const budgets = await getRepository(Budget).find();
        expect(budgets.length).toEqual(1);

        expect(budgets[0].name).toBe("test");
        expect(budgets[0].id).not.toBeNull();
      });
    });

    describe("when creating a duplicate file", () => {
      it("should return an error message", async () => {
        await resolver.createBudget({ name: "test" });

        const result = await resolver.createBudget({ name: "test" });
        expect(result.error).not.toBeNull();
      });
    });
  });

  describe("deleteBudget", () => {
    it("should remove the specified budget", async () => {
      await resolver.createBudget({ name: "test" });

      const result = await resolver.deleteBudget("test.yaba");
      expect(result.length).toBe(0);
    });

    it("should not remove other budgets", async () => {
      await Promise.all([
        await resolver.createBudget({ name: "test" }),
        await resolver.createBudget({ name: "test2" })
      ]);

      const result = await resolver.deleteBudget("test.yaba");
      expect(result.length).toBe(1);
      expect(result[0].path).toContain("test2");
    });

    describe("when the budget does not exist", () => {
      it("should return normally", async () => {
        await resolver.createBudget({ name: "test" });

        await resolver.deleteBudget("test.yaba");

        const result = await resolver.deleteBudget("test.yaba");
        expect(result.length).toBe(0);
      });
    });

    it("should close the connection if needed", async () => {
      const createResult = await resolver.createBudget({ name: "test" });
      await initConnect(createResult.budgetFile?.path ?? "");

      const result = await resolver.deleteBudget("test.yaba");
      expect(result.length).toBe(0);
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
