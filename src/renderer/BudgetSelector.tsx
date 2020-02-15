import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Theme,
  createStyles,
  makeStyles
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import BudgetSelectorListItem from "./BudgetSelectorListItem";
import { BudgetSelectorQuery } from "./__generated__/BudgetSelectorQuery";
import LoadingOverlay from "./LoadingOverlay";
import React from "react";
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

export const BUDGET_SELECTOR_QUERY = gql`
  query BudgetSelectorQuery {
    budgetFiles {
      path
      ...BudgetSelectorListItem_file
    }
  }
  ${BudgetSelectorListItem.fragments.file}
`;

export default function BudgetSelector(props: Props) {
  const styles = useStyles();
  const { loading, data } = useQuery<BudgetSelectorQuery>(
    BUDGET_SELECTOR_QUERY
  );

  return (
    <>
      <LoadingOverlay open={loading} />
      <Container fixed maxWidth="sm" className={styles.container}>
        <Card>
          <CardHeader title="Open Or Create Budget" />
          <CardContent>
            <List subheader={<ListSubheader>Existing Budgets</ListSubheader>}>
              {data?.budgetFiles?.map(file => (
                <BudgetSelectorListItem key={file.path} file={file} />
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
