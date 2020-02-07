import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Paper,
  TextField
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import AddIcon from "@material-ui/icons/Add";

export default function NewBudget(): ReactElement {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const createNewBudget = () => {
    if (name === "") {
      setNameError("You must name your new budget.");
      return;
    }
  };

  return (
    <Container fixed maxWidth="sm">
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
              error={nameError !== null}
              helperText={nameError}
              variant="outlined"
            />
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={createNewBudget}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
