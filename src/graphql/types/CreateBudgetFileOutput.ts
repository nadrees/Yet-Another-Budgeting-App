import { Field, ObjectType } from "type-graphql";

import { BudgetFile } from "./BudgetFile";

@ObjectType()
export abstract class CreateBudgetFileOutput {
  @Field({ nullable: true })
  budgetFile?: BudgetFile;

  @Field({ nullable: true })
  error?: string;
}
