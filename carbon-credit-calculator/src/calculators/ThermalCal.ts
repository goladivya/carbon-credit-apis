import {PRECISION} from '../calculator';
import { ThermalCreationRequest } from '../requests/thermalCreationRequest';
const convert = require('convert-units');


export class ThermalCal{
    public static calculate (req :ThermalCreationRequest):number{
        const constants = req.ThermalConstants;
        const emissionData = constants.emissionFactors[req.fuelType];
           if (!emissionData) {
      throw new Error(`Unsupported fuel type: ${req.fuelType}`);
    }

    let convertedFuelAmount;
    try {
      convertedFuelAmount = convert(req.fuelAmount).from(req.fuelUnit).to(emissionData.unit);
    } catch (e) {
      throw new Error(`Failed to convert from ${req.fuelUnit} to ${emissionData.unit}`);
    }

    const emission = convertedFuelAmount * emissionData.factor;
    return Number(emission.toFixed(PRECISION));
  }


}