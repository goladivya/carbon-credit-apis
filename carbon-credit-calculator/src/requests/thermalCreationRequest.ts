import { CreditCreationRequest } from "./creditCreationRequest";
import { ThermalConstants } from "../constants/thermalConstants";

export class ThermalCreationRequest implements CreditCreationRequest {
    fuelType!: string;
    fuelAmount!: number;
    fuelUnit!: string;
    countryCode!: string; // Default to US if not specified

    emissionFactor!: number;
    expectedUnit!: string;
    source!: string;

}