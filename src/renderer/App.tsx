import React, { ReactElement, useReducer } from "react";

import BudgetSelector from "./BudgetSelector";
import NewBudget from "./NewBudget";

type View =
  | { name: "SelectBudget" }
  | { name: "NewBudget" }
  | { name: "LoadBudget"; path: string };

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
  const [state, dispatch] = useReducer(reducer, {
    view: { name: "SelectBudget" }
  });

  switch (state.view.name) {
    case "SelectBudget":
      return (
        <BudgetSelector
          onNewBudgetClicked={() =>
            dispatch({ type: "SetView", view: { name: "NewBudget" } })
          }
        />
      );
    case "NewBudget":
      return (
        <NewBudget
          onBudgetCreated={(path: string) =>
            dispatch({ type: "SetView", view: { name: "LoadBudget", path } })
          }
          onCancelClicked={() =>
            dispatch({ type: "SetView", view: { name: "SelectBudget" } })
          }
        />
      );
    case "LoadBudget":
      return <div>Load Budget</div>;
  }
}
