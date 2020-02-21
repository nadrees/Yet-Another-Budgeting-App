import { Budget } from "../Budget";

describe("Budget", () => {
  describe("new", () => {
    it("should set the name property correctly", () => {
      const name = "test";

      const budget = Budget.new(name);
      expect(budget.name).toEqual(name);
    });
  });
});
