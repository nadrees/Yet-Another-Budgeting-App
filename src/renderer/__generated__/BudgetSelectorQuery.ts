/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BudgetSelectorQuery
// ====================================================

export interface BudgetSelectorQuery_budgetFiles {
  __typename: "BudgetFile";
  path: string;
}

export interface BudgetSelectorQuery {
  budgetFiles: BudgetSelectorQuery_budgetFiles[];
}
