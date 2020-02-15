import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

import React from "react";

type Props = {
  open: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteBudgetDialog(props: Props) {
  const { open, name, onCancel, onConfirm } = props;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>
          Delete <b>{name}</b>? This action is permanent and cannot be undone.
          All data will be deleted immediately.
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            autoFocus
            variant="contained"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>OK</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
