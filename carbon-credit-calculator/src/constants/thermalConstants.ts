import { SubSectorConstants } from "./subSectorConstants";


export class ThermalConstants implements SubSectorConstants{
     emissionFactorsByCountry: Record<string, any> = {
    IN: {
      diesel: { factor: 2.68, unit: "l", source: "IPCC / MoEFCC - 2023", year: 2023 },
      coal: { factor: 2.42, unit: "kg", source: "CEA India - 2022", year: 2022 },
      natural_gas: { factor: 2.03, unit: "m3", source: "IPCC -2023", year: 2023 }
    },
    US: {
      diesel: { factor: 2.68, unit: "l", source: "U.S. EPA - 2022", year: 2022 },
      coal: { factor: 2.45, unit: "kg", source: "U.S. EPA - 2022", year: 2022 },
      natural_gas: { factor: 1.95, unit: "m3", source: "U.S. EPA-2022", year: 2022 }
    },
    UK: {
      diesel: { factor: 2.52, unit: "l", source: "UK BEIS-2023", year: 2023 },
      coal: { factor: 2.36, unit: "kg", source: "UK BEIS-2023", year: 2022 },
      natural_gas: { factor: 1.88, unit: "m3", source: "UK BEIS-2023", year: 2023 }
    }
  };

  getEmissionFactor(fuelType: string, countryCode: string) {
    const factors = this.emissionFactorsByCountry[countryCode] || this.emissionFactorsByCountry["US"];
    return factors[fuelType];
  }
}
