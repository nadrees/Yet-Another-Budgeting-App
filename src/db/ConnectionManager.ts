import { Connection, createConnection } from "typeorm";

import { Budget } from "./entity/Budget";

let connection: Connection | null;

async function loadBudget(file: string, name: string): Promise<void> {
  await closeBudget();
  connection = await createConnection({
    type: "sqlite",
    database: file,
    synchronize: true,
    logging: false,
    entities: [Budget]
  });
  const budgetRepository = connection.getRepository(Budget);
  const budgets = await budgetRepository.find({ take: 1 });
  if (budgets.length === 0) {
    const budget = new Budget();
    budget.name = name;
    await budgetRepository.save(budget);
  }
}

async function closeBudget(): Promise<void> {
  await connection?.close();
  connection = null;
}

export default {
  closeBudget,
  loadBudget
};
