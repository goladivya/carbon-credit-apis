import { PRECISION } from "../calculator";
import { TransportationCreationRequest } from "../requests/transportationCreationRequests";


const convert = require("convert-units");

export class NonEvCarCal {
  public static calculate(req: TransportationCreationRequest ): number {
    const constants = req.transportationconstants;
      if (req.fuelUsed < 0) {
            throw new Error("Fuel used cannot be negative");
        }


    const fuelEmissionUnit = constants.fuelEmissionUnit.split("/")[1]; 
    let convertedFuelUsed: number;

  

    try {
      convertedFuelUsed = convert(req.fuelUsed).from(req.fuelUnit).to(fuelEmissionUnit);
    } catch (e) {
      throw new Error("Invalid fuel unit provided or conversion failed.");
    }

    const emissions = convertedFuelUsed * constants.fuelEmissionFactor; 
    return Number(emissions.toFixed(PRECISION));
  }
}
