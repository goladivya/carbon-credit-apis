import { PRECISION } from "../calculator";
import { TransportationCreationRequest } from "../requests/transportationCreationRequests";

const convert = require("convert-units");

export class NonEvCarCal {
  public static calculate(req: TransportationCreationRequest): number {
    const constants = req.transportationconstants;

    if (!constants.emissionFactors[req.vehicleType]) {
      throw new Error("Invalid vehicle type: " + req.vehicleType);
    }

    if (req.fuelUsed < 0) {
      throw new Error("Fuel used cannot be negative");
    }

    const factor = constants.emissionFactors[req.vehicleType];
    const expectedUnit = constants.fuelEmissionUnit.split("/")[1]; // "l"

    let convertedFuelUsed: number;
    try {
      convertedFuelUsed = convert(req.fuelUsed).from(req.fuelUnit).to(expectedUnit);
    } catch (e) {
      throw new Error(`Invalid fuel unit '${req.fuelUnit}' or conversion to '${expectedUnit}' failed.`);
    }

    const emissionsKg = convertedFuelUsed * factor;
    const emissionsTon = emissionsKg / 1000;

    return Number(emissionsTon.toFixed(PRECISION));
  }
}
