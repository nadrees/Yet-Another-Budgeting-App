import React, { ReactElement, useReducer } from "react";

import BudgetSelector from "./BudgetSelector";
import NewBudget from "./NewBudget";

type View = "SelectBudget" | "NewBudget";

type State = {
  view: View;
};

type Action = { type: "SetView"; view: View };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SetView":
      return { ...state, view: action.view };
  }
}

export default function App(): NonNullable<ReactElement> {
  const [state, dispatch] = useReducer(reducer, { view: "SelectBudget" });

  switch (state.view) {
    case "SelectBudget":
      return (
        <BudgetSelector
          onNewBudgetClicked={() =>
            dispatch({ type: "SetView", view: "NewBudget" })
          }
        />
      );
    case "NewBudget":
      return <NewBudget />;
  }
}
