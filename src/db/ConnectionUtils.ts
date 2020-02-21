import AllEntities from "./AllEntities";
import { createConnection } from "typeorm";

// this only exists so that we can mock it out in tests, to create
// an in memory db instead
export async function initConnect(fileName: string): Promise<void> {
  await createConnection({
    type: "sqlite",
    database: fileName,
    synchronize: true,
    logging: false,
    entities: AllEntities
  });
}
