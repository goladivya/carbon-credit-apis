import {SubSectorConstants} from './subSectorConstants';

export class TransportationConstant implements  SubSectorConstants{
    fuelEmissionFactor: number = 2.31; // kg CO₂ per liter of petrol
    fuelEmissionUnit: string = "kgCO2/l";
}