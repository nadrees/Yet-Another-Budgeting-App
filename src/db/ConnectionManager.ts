import { Connection, createConnection } from "typeorm";
import { Err, Ok, Result } from "@usefultools/monads";

import { Budget } from "./entity/Budget";

let connection: Connection | null;

async function createNewConnection(file: string): Promise<Connection> {
  return await createConnection({
    type: "sqlite",
    database: file,
    synchronize: true,
    logging: false,
    entities: [Budget]
  });
}

async function createBudget(
  file: string,
  name: string
): Promise<Result<null, string>> {
  const tempConnection = await createNewConnection(file);
  const budgetRepository = tempConnection.getRepository(Budget);
  const budgets = await budgetRepository.find({ take: 1 });
  if (budgets.length > 0) {
    return Err(`${file} already exists`);
  }

  await budgetRepository.save(Budget.new(name));

  return Ok(null);
}

async function loadBudget(file: string, name: string): Promise<void> {
  await closeBudget();
  connection = await createNewConnection(file);
}

async function closeBudget(): Promise<void> {
  await connection?.close();
  connection = null;
}

export default {
  createBudget,
  closeBudget,
  loadBudget
};
