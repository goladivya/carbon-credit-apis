import { CreditCreationRequest } from "./creditCreationRequest";
import { TransmissionConstants } from "../constants/electricityConstant";

export class TransmissionCreationRequest implements CreditCreationRequest{
    totalGenerated!: number;      
    totalDelivered!: number;       
    unit!: string;  
    countryCode!: string  // Default to US if not specified             
    transmissionConstants = new TransmissionConstants();
}