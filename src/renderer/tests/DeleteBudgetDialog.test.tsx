import { ReactWrapper, ShallowWrapper, mount, shallow } from "enzyme";
import { createMount, createShallow } from "@material-ui/core/test-utils";

import DeleteBudgetDialog from "../DeleteBudgetDialog";
import React from "react";

describe("<DeleteBudgetDialog />", () => {
  let renderShallow: typeof shallow;

  let component: ShallowWrapper;
  let onCancel: jest.Mock<any, any>;
  let onConfirm: jest.Mock<any, any>;

  beforeAll(() => {
    renderShallow = createShallow();
  });

  beforeEach(() => {
    onCancel = jest.fn();
    onConfirm = jest.fn();

    component = renderShallow(
      <DeleteBudgetDialog
        open={true}
        name="test"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
  });

  it("should display the name of the budget being deleted", () => {
    expect(
      component.find('[data-testid="dialog-content-text"]').text()
    ).toContain("test");
  });

  it("should forward the open prop to the dialog component", () => {
    expect(component.find('[data-testid="dialog"]').prop("open")).toBeTruthy();
  });

  it("should call the onCancel function when the cancel button is clicked", () => {
    component.find('[data-testid="cancel-button"]').simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });

  it("should call the onConfirm function when the ok button is clicked", () => {
    component.find('[data-testid="ok-button"]').simulate("click");
    expect(onConfirm).toHaveBeenCalled();
  });
});
