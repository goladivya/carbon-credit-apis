import { CreditCreationRequest } from "./creditCreationRequest";
//import { TransportationConstant } from "../constants/transportationConsrants";

export class TransportationCreationRequest implements CreditCreationRequest {
  vehicleType!: string;
  fuelUsed!: number;
  fuelUnit!: "l";
  transportationconstants!: {
    emissionFactors: { [vehicleType: string]: number };
    fuelEmissionUnit: string;
    source: string;
    year: number;
  };
}
