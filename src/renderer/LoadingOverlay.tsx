import {
  Backdrop,
  CircularProgress,
  Theme,
  createStyles,
  makeStyles
} from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1
    }
  })
);

type Props = {
  open: boolean;
};

export default function LoadingOverlay(props: Props): ReactElement {
  const styles = useStyles();
  return (
    <Backdrop open={props.open} className={styles.backdrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
