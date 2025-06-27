import {SubSectorConstants} from './subSectorConstants';

export class TransportationConstant implements  SubSectorConstants{
     emissionFactors: { [vehicleType: string]: number } = {
        petrol_car: 2.31,
        diesel_car: 2.68,
        motorcycle: 2.31,
        bus: 2.68,
        truck: 2.68
    };

    fuelEmissionUnit: string = "kgCO2/l";
}