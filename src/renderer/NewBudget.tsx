import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  TextField,
  createStyles,
  makeStyles
} from "@material-ui/core";
import {
  NewBudgetMutation,
  NewBudgetMutationVariables
} from "./__generated__/NewBudgetMutation";
import React, { ReactElement, useEffect, useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import LoadingOverlay from "./LoadingOverlay";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const useStyles = makeStyles(() =>
  createStyles({
    cardActions: {
      marginLeft: "0.5rem",
      marginBottom: "0.5rem"
    },
    cancelButton: {
      marginLeft: "auto",
      marginRight: "0.5rem"
    },
    container: {
      marginTop: "1rem"
    }
  })
);

type Props = {
  onBudgetCreated: (path: string) => void;
  onCancelClicked: () => void;
};

export default function NewBudget(props: Props): ReactElement {
  const { onBudgetCreated, onCancelClicked } = props;

  const styles = useStyles();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const [createBudget, { loading, data }] = useMutation<NewBudgetMutation>(gql`
    mutation NewBudgetMutation($args: CreateBudgetFileInput!) {
      createBudget(args: $args) {
        budgetFile {
          path
        }
        error
      }
    }
  `);

  useEffect(() => {
    const budgetPath = data?.createBudget.budgetFile?.path;
    if (budgetPath != null) {
      onBudgetCreated(budgetPath);
    }
  }, [data, onBudgetCreated]);

  const nameFieldError = nameError ?? data?.createBudget?.error;

  return (
    <>
      <LoadingOverlay open={loading} />
      <Container fixed maxWidth="sm" className={styles.container}>
        <Card>
          <CardHeader title="Create New Budget" />
          <CardContent>
            <form autoCorrect="off">
              <TextField
                label="Name"
                placeholder="My New Budget"
                fullWidth
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
                error={nameFieldError != null}
                helperText={nameFieldError}
                variant="outlined"
              />
            </form>
          </CardContent>
          <CardActions disableSpacing className={styles.cardActions}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                if (name === "") {
                  setNameError("You must name your new budget.");
                } else {
                  const variables: NewBudgetMutationVariables = {
                    args: { name }
                  };

                  setNameError(null);
                  createBudget({ variables });
                }
              }}
            >
              Create
            </Button>
            <Button
              variant="contained"
              className={styles.cancelButton}
              onClick={onCancelClicked}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
