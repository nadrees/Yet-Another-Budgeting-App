import { Query, Resolver, Mutation, Arg } from "type-graphql";

import { BudgetFile } from "../types/BudgetFile";
import { app } from "electron";
import fs from "fs";
import path from "path";
import util from "util";
import sanitize from "sanitize-filename";
import { CreateBudgetFileInput } from "../types/CreateBudgetFileInput";
import { CreateBudgetFileOutput } from "../types/CreateBudgetFileOutput";
import { getRepository, getConnection } from "typeorm";
import { Budget } from "../../db/entity/Budget";
import { initConnect } from "../../db/ConnectionUtils";

const readdir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);

export async function getDbFolder(): Promise<string> {
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

    await initConnect(fullPath);

    await getRepository(Budget).insert(Budget.new(args.name));

    await getConnection().close();

    return {
      budgetFile: {
        path: fullPath
      }
    };
  }

  @Mutation(returns => [BudgetFile])
  async deleteBudget(@Arg("name") fileName: string): Promise<BudgetFile[]> {
    const dbFolder = await getDbFolder();
    const fullPath = path.join(dbFolder, fileName);

    const connection = getConnection();
    if (connection.isConnected && connection.options.database === fullPath) {
      await connection.close();
    }

    if (await exists(fullPath)) {
      await unlink(fullPath);
    }

    return await this.budgetFiles();
  }
}
