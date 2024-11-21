import { Decimal } from "@prisma/client/runtime/library";

import { FUNDING_REQUEST_NO_HOURS } from "../../../../test/fixtures";
import { validateCoutsHoraires } from "./couts-horaires";

test("Should yield an error when individualCost > 70", () => {
  const errors = validateCoutsHoraires({
    ...FUNDING_REQUEST_NO_HOURS,
    individualCost: new Decimal(72),
  });
  expect(errors.length).toBe(1);
  expect(errors[0].fieldName).toBe("individualCost");
  expect(errors[0].message).toContain("70");
});

test("Should yield an error when collectiveCost > 35", () => {
  const errors = validateCoutsHoraires({
    ...FUNDING_REQUEST_NO_HOURS,
    collectiveCost: new Decimal(37),
  });
  expect(errors.length).toBe(1);
  expect(errors[0].fieldName).toBe("collectiveCost");
  expect(errors[0].message).toContain("35");
});

test("Should be ok with collectiveCost:35 and individualCost:70", () => {
  const errors = validateCoutsHoraires({
    ...FUNDING_REQUEST_NO_HOURS,
    individualCost: new Decimal(70),
    collectiveCost: new Decimal(35),
  });
  expect(errors.length).toBe(0);
});
