import { CreditCreationRequest } from "./creditCreationRequest";

export class SolarCreationRequest implements CreditCreationRequest {
  energyGeneration!: number;
  energyGenerationUnit!: string;
  buildingType!: string;
  countryCode!: string;

  emissionFactor!: number;
  thresholdUnit!: string;
  buildingTypes!: { [k: string]: number };
}
