import { Decimal } from "@prisma/client/runtime/library";

import { FUNDING_REQUEST_FULL_CERT_OK_HOURS } from "../../../../test/fixtures";
import { validateAccompagnement } from "./accompagnement";

test("Should yield an error when no cost associated to hour count for accompaniment", () => {
  const errors = validateAccompagnement({
    individualHourCount: new Decimal(2),
    individualCost: new Decimal(0),
    collectiveHourCount: new Decimal(3),
    collectiveCost: new Decimal(0),
  });
  expect(errors.length).toBe(2);
  expect(errors[0].fieldName).toBe("individualCost");
  expect(errors[0].message).toContain("Le coût horaire ne peut être nul");
  expect(errors[1].fieldName).toBe("collectiveCost");
  expect(errors[1].message).toContain("Le coût horaire ne peut être nul");
});

test("Should be ok with only individual hours", () => {
  const errors = validateAccompagnement({
    ...FUNDING_REQUEST_FULL_CERT_OK_HOURS,
    individualHourCount: new Decimal(2),
    individualCost: new Decimal(24.5),
  });
  expect(errors.length).toBe(0);
});

test("Should be ok with individual + collective hours", () => {
  const errors = validateAccompagnement({
    ...FUNDING_REQUEST_FULL_CERT_OK_HOURS,
    individualHourCount: new Decimal(2),
    individualCost: new Decimal(24.5),
    collectiveHourCount: new Decimal(3.5),
    collectiveCost: new Decimal(14.82),
  });
  expect(errors.length).toBe(0);
});
