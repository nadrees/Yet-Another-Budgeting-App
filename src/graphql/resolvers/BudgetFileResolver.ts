import { Query, Resolver, Mutation, Arg } from "type-graphql";

import { BudgetFile } from "../types/BudgetFile";
import { app } from "electron";
import fs from "fs";
import path from "path";
import util from "util";
import sanitize from "sanitize-filename";
import { CreateBudgetFileInput } from "../types/CreateBudgetFileInput";
import ConnectionManager from "../../db/ConnectionManager";
import { CreateBudgetFileOutput } from "../types/CreateBudgetFileOutput";

const readdir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

async function getDbFolder(): Promise<string> {
  const dbFolder = path.join(app.getPath("userData"), "budgets");
  if (!(await exists(dbFolder))) {
    await mkdir(dbFolder, {
      recursive: true
    });
  }
  return dbFolder;
}

@Resolver(BudgetFile)
export class BudgetFileResolver {
  @Query(returns => [BudgetFile])
  async budgetFiles(): Promise<BudgetFile[]> {
    const dbFolder = await getDbFolder();
    const files = await readdir(dbFolder);
    return files
      .filter(f => path.extname(f).toLowerCase() === ".yaba")
      .map(f => {
        const budgetFile = new BudgetFile();
        budgetFile.path = f;
        return budgetFile;
      });
  }

  @Mutation(returns => CreateBudgetFileOutput)
  async createBudget(
    @Arg("args") args: CreateBudgetFileInput
  ): Promise<CreateBudgetFileOutput> {
    const dbFolder = await getDbFolder();
    const fileName = sanitize(args.name) + ".yaba";
    const fullPath = path.join(dbFolder, fileName);

    if (await exists(fullPath)) {
      return {
        error:
          "This name is already taken, or would result in a duplicate budget file. Please chose another name."
      };
    }

    await ConnectionManager.loadBudget(fullPath, args.name);

    return {
      budgetFile: {
        path: fullPath
      }
    };
  }
}
