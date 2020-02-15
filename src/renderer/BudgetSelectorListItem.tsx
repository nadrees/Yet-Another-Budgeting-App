import {
  DeleteBudgetMutation,
  DeleteBudgetMutationVariables
} from "./__generated__/DeleteBudgetMutation";
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import React, { useState } from "react";

import { BUDGET_SELECTOR_QUERY } from "./BudgetSelector";
import { BudgetSelectorListItem_file } from "./__generated__/BudgetSelectorListItem_file";
import DeleteBudgetDialog from "./DeleteBudgetDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingOverlay from "./LoadingOverlay";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

type Props = {
  file: BudgetSelectorListItem_file;
};

export default function BudgetSelectorListItem(props: Props) {
  const { file } = props;

  const [
    budgetToDelete,
    setBudgetToDelete
  ] = useState<BudgetSelectorListItem_file | null>(null);
  const [deleteBudget, { loading, client }] = useMutation<DeleteBudgetMutation>(
    gql`
      mutation DeleteBudgetMutation($path: String!) {
        deleteBudget(path: $path) {
          __typename
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: BUDGET_SELECTOR_QUERY
        }
      ]
    }
  );

  return (
    <ListItem button key={file.path}>
      <LoadingOverlay open={loading} />
      {budgetToDelete != null ? (
        <DeleteBudgetDialog
          open={true}
          name={budgetToDelete.path}
          onCancel={() => setBudgetToDelete(null)}
          onConfirm={() => {
            const variables: DeleteBudgetMutationVariables = {
              path: file.path
            };

            setBudgetToDelete(null);
            deleteBudget({ variables });
          }}
        />
      ) : null}
      <ListItemText primary={file.path} />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => setBudgetToDelete(file)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

BudgetSelectorListItem.fragments = {
  file: gql`
    fragment BudgetSelectorListItem_file on BudgetFile {
      path
    }
  `
};
