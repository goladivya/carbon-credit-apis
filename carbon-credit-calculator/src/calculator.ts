import { AgricultureCal } from "./calculators/agricultureCal";
import { TransmissionLossCal } from "./calculators/elctricitylossesCal";
import { HydroCal } from "./calculators/HydroCal";
import { NonEvCarCal } from "./calculators/nonevcarCal";
import { SolarCal } from "./calculators/solarCal";
import { ThermalCal } from "./calculators/ThermalCal";
import { AgricultureCreationRequest } from "./requests/agricultureCreationRequest";
import { CreditCreationRequest } from "./requests/creditCreationRequest";
import { HydroCreationRequest } from "./requests/hydroCreationRequest";
import { SolarCreationRequest } from "./requests/solarCreationRequest";
import { ThermalCreationRequest } from "./requests/thermalCreationRequest";
import { TransmissionCreationRequest } from "./requests/transmissionCreationRequest";
import { TransportationCreationRequest } from "./requests/transportationCreationRequests";

export const PRECISION = 2
export const calculateCredit = (request: CreditCreationRequest): number => {
    if (request instanceof AgricultureCreationRequest) {
        return AgricultureCal.calculate(request)
    } else if (request instanceof SolarCreationRequest) {
        return SolarCal.calculate(request)
    } else if(request instanceof ThermalCreationRequest){
        return ThermalCal.calculate(request)
    } else if(request instanceof HydroCreationRequest){
        return HydroCal.calculate(request)
    }else if(request instanceof TransmissionCreationRequest){
        return TransmissionLossCal.calculate(request)
    }else if (request instanceof TransportationCreationRequest) {
            return NonEvCarCal.calculate(request)
    }
    else {
        throw Error("Not implemented")
    }
}