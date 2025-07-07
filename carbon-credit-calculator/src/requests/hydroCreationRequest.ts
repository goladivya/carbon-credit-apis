import { CreditCreationRequest } from "./creditCreationRequest";

export class HydroCreationRequest implements CreditCreationRequest {
  reservoirArea!: number;
  areaUnit!: string;
  duration!: number;
  durationUnit!: string;
  hydroConstant!: {
    factor: number;
    unit: string;
    source: string;
    year: number;
  };
}
