// transportationConstants.ts
import { SubSectorConstants } from "./subSectorConstants";

export class TransportationConstant implements SubSectorConstants {
  emissionFactorsByCountry: Record<
    string,
    {
      emissionFactors: { [vehicleType: string]: number };
      fuelEmissionUnit: string;
      source: string;
      year: number;
    }
  > = {
    IN: {
      emissionFactors: {
        petrol_car: 2.31,
        diesel_car: 2.68,
        motorcycle: 2.31,
        bus: 2.68,
        truck: 2.68
      },
      fuelEmissionUnit: "kgCO₂/l",
      source: "MoEFCC 2023",
      year: 2023
    },
    US: {
      emissionFactors: {
        petrol_car: 2.30,
        diesel_car: 2.65,
        motorcycle: 2.30,
        bus: 2.65,
        truck: 2.65
      },
      fuelEmissionUnit: "kgCO₂/l",
      source: "US EPA 2022",
      year: 2022
    },
    UK: {
      emissionFactors: {
        petrol_car: 2.29,
        diesel_car: 2.60,
        motorcycle: 2.29,
        bus: 2.60,
        truck: 2.60
      },
      fuelEmissionUnit: "kgCO₂/l",
      source: "UK BEIS 2023",
      year: 2023
    }
  };

  getCountryConstants(countryCode: string) {
    return this.emissionFactorsByCountry[countryCode] || this.emissionFactorsByCountry["US"];
  }
}
