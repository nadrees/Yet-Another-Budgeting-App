import {
  BudgetSelectorQuery,
  BudgetSelectorQuery_budgetFiles
} from "./__generated__/BudgetSelectorQuery";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Theme,
  createStyles,
  makeStyles
} from "@material-ui/core";
import React, { useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import DeleteBudgetDialog from "./DeleteBudgetDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingOverlay from "./LoadingOverlay";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: "1rem"
    }
  })
);

type Props = {
  onNewBudgetClicked: () => void;
};

export default function BudgetSelector(props: Props) {
  const styles = useStyles();
  const { loading, data } = useQuery<BudgetSelectorQuery>(gql`
    query BudgetSelectorQuery {
      budgetFiles {
        path
      }
    }
  `);
  const [
    budgetToDelete,
    setBudgetToDelete
  ] = useState<BudgetSelectorQuery_budgetFiles | null>(null);

  return (
    <>
      <LoadingOverlay open={loading} />
      {budgetToDelete != null ? (
        <DeleteBudgetDialog
          open={true}
          name={budgetToDelete.path}
          onCancel={() => setBudgetToDelete(null)}
          onConfirm={() => {
            // TODO
          }}
        />
      ) : null}
      <Container fixed maxWidth="sm" className={styles.container}>
        <Card>
          <CardHeader title="Open Or Create Budget" />
          <CardContent>
            <List subheader={<ListSubheader>Existing Budgets</ListSubheader>}>
              {data?.budgetFiles?.map(file => (
                <ListItem button key={file.path}>
                  <ListItemText primary={file.path} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => setBudgetToDelete(file)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {data?.budgetFiles?.length ? <Divider /> : null}
              <ListItem button onClick={props.onNewBudgetClicked}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New Budget" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
