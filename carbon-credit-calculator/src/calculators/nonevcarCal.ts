import { PRECISION } from "../calculator";
import { TransportationCreationRequest } from "../requests/transportationCreationRequests";
import { TransportationConstant } from "../constants/transportationConsrants";

const convert = require("convert-units");

export class NonEvCarCal {
  public static calculate(req: TransportationCreationRequest): number {
    const constants: TransportationConstant = req.transportationconstants;

    if (!constants.emissionFactors[req.vehicleType]) {
      throw new Error("Invalid vehicle type: " + req.vehicleType);
    }

    if (req.fuelUsed < 0) {
      throw new Error("Fuel used cannot be negative");
    }

    const factor = constants.emissionFactors[req.vehicleType]; // kg CO2/l
    const expectedUnit = constants.fuelEmissionUnit.split("/")[1]; // e.g., "liter"

    let convertedFuelUsed: number;
    try {
      convertedFuelUsed = convert(req.fuelUsed).from(req.fuelUnit).to(expectedUnit);
    } catch (e) {
      throw new Error(`Invalid fuel unit '${req.fuelUnit}' or conversion to '${expectedUnit}' failed.`);
    }

    const emissions = convertedFuelUsed * factor; 
    const emissionsInTonnes = emissions / 1000;   

    return Number(emissionsInTonnes.toFixed(PRECISION));
  }
}
