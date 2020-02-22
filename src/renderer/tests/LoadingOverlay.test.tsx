import LoadingOverlay from "../LoadingOverlay";
import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { shallow } from "enzyme";

describe("<LoadingOverlay />", () => {
  let renderShallow: typeof shallow;

  beforeAll(() => {
    renderShallow = createShallow();
  });

  [true, false].forEach(open =>
    it(`should forward the open prop to the backdrop (open = ${open})`, () => {
      const component = renderShallow(<LoadingOverlay open={open} />);
      expect(
        component.find("WithStyles(ForwardRef(Backdrop))").prop("open")
      ).toEqual(open);
    })
  );

  it("should render a spinner", () => {
    const component = renderShallow(<LoadingOverlay open={true} />);
    expect(
      component.find("WithStyles(ForwardRef(CircularProgress))").length
    ).toBe(1);
  });
});
