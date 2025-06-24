import { CreditCreationRequest } from "./creditCreationRequest";
import { TransportationConstant } from "../constants/transportationConsrants";

export class TransportationCreationRequest implements CreditCreationRequest{
    fuelUsed!: number;         
    fuelUnit!: string; 
    transportationconstants = new TransportationConstant();
}