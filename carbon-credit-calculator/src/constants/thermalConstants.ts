import { SubSectorConstants } from "./subSectorConstants";


export class ThermalConstants implements SubSectorConstants{
    emissionFactors: { [fuelType: string]: { factor: number; unit: string } } = {
    coal: { factor: 2.42, unit: 'kg' },        // kg CO2 / kg coal
    diesel: { factor: 2.68, unit: 'l' },   // kg CO2 / litre
    natural_gas: { factor: 1.90, unit: 'm3' }, // kg CO2 / m3
  };

}