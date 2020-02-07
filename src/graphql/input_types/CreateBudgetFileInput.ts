import { Field, InputType } from "type-graphql";

@InputType()
export class CreateBudgetFileInput {
  @Field()
  name: string;
}
