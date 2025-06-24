import { CreditCreationRequest } from "./creditCreationRequest";
import { HydroConstant } from "../constants/hydroConstants";

export class HydroCreationRequest  implements  CreditCreationRequest{
     reservoirArea ! :number;
     areaUnit!:string;
     duration!:number;
     durationUnit!:string;
     hydroConstant = new HydroConstant();
}