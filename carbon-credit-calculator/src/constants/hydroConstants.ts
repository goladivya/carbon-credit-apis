import { SubSectorConstants } from "./subSectorConstants";

export class HydroConstant implements SubSectorConstants {
  emissionFactorsByCountry: Record<
    string,
    { factor: number; unit: string; source: string }
  > = {
    IN: { factor: 1500, unit: "tCO₂e/km2/year", source: "CWC India 2022" },
    US: { factor: 1200, unit: "tCO₂e/km2/year", source: "US DOE 2021 "},
    UK: { factor: 1000, unit: "tCO₂e/km2/year", source: "UK DEFRA 2023" },
    DE: { factor: 1100, unit: "tCO₂e/km2/year", source: "UBA Germany 2022 "},
    FR: { factor: 900, unit: "tCO₂e/km2/year", source: "RTE France 2022" }
  };

  getCountryConstants(countryCode: string) {
    return this.emissionFactorsByCountry[countryCode] || this.emissionFactorsByCountry["US"];
  }
}
