import { PRECISION } from "../calculator";
import { HydroCreationRequest } from "../requests/hydroCreationRequest";
const convert = require("convert-units");

export class HydroCal {
  public static calculate(req: HydroCreationRequest): number {
    const constants = req.hydroConstant;
    const unitParts = constants.unit.split("/");

    if (unitParts.length !== 3) {
      throw new Error("Invalid emission factor unit format");
    }

    const areaConverted = convert(req.reservoirArea).from(req.areaUnit).to(unitParts[1]);
    const durationConverted = convert(req.duration).from(req.durationUnit).to(unitParts[2]);

    const emission = constants.factor * areaConverted * durationConverted;
    return Number(emission.toFixed(PRECISION));
  }
}
