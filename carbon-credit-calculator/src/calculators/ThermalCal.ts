import { PRECISION } from "../calculator";
import { ThermalCreationRequest } from "../requests/thermalCreationRequest";

export class ThermalCal {
  public static calculate(req: ThermalCreationRequest): number {
    if (req.fuelUnit !== req.expectedUnit) {
      throw new Error(
        `Unit mismatch: expected '${req.expectedUnit}' for ${req.fuelType}, but got '${req.fuelUnit}'`
      );
    }

    const emission = req.fuelAmount * req.emissionFactor;
    return Number(emission.toFixed(PRECISION));
  }
}
