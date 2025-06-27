import { CreditCreationRequest } from "./creditCreationRequest";
import { TransportationConstant } from "../constants/transportationConsrants";

export class TransportationCreationRequest implements CreditCreationRequest{
    vehicleType!: string;
    fuelUsed!: number;         
    fuelUnit!: "l"; 
    transportationconstants = new TransportationConstant();
}