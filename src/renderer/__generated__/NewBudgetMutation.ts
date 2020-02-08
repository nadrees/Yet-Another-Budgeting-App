/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateBudgetFileInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: NewBudgetMutation
// ====================================================

export interface NewBudgetMutation_createBudget_budgetFile {
  __typename: "BudgetFile";
  path: string;
}

export interface NewBudgetMutation_createBudget {
  __typename: "CreateBudgetFileOutput";
  budgetFile: NewBudgetMutation_createBudget_budgetFile | null;
  error: string | null;
}

export interface NewBudgetMutation {
  createBudget: NewBudgetMutation_createBudget;
}

export interface NewBudgetMutationVariables {
  args: CreateBudgetFileInput;
}
