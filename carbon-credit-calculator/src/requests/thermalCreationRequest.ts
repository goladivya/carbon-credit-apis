import { CreditCreationRequest } from "./creditCreationRequest";
import { ThermalConstants } from "../constants/thermalConstants";

export  class ThermalCreationRequest implements CreditCreationRequest{
    fuelType!: string; 
    fuelAmount!: number; 
    fuelUnit!: string; 
    ThermalConstants = new ThermalConstants();
   
}