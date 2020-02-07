import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class BudgetFile {
  @Field()
  path: string;
}
