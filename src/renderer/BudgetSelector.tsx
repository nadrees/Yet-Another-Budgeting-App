import {
  Backdrop,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Theme,
  createStyles,
  makeStyles
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { BudgetSelectorQuery } from "./__generated__/BudgetSelectorQuery";
import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1
    },
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

  if (loading) {
    return (
      <Backdrop open={true} className={styles.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <Container fixed maxWidth="sm" className={styles.container}>
        <Paper elevation={3}>
          <List
            subheader={<ListSubheader>Open Or Create Budget</ListSubheader>}
          >
            {data?.budgetFiles?.map(file => (
              <ListItem button key={file.path}>
                <ListItemText primary={file.path} />
              </ListItem>
            ))}
            {data?.budgetFiles?.length ? <Divider /> : null}
            <ListItem button>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="New Budget"
                onClick={props.onNewBudgetClicked}
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    );
  }
}