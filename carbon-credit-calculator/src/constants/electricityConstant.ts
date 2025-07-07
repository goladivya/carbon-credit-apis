import { SubSectorConstants } from "./subSectorConstants";

export class TransmissionConstants implements SubSectorConstants {
  gridEmissionFactorsByCountry: Record< string, { factor: number; unit: string; source: string }> = {
    IN: { factor: 0.82, unit: "tCO₂/MWh", source: "CEA India 2022" },
    US: { factor: 0.45, unit: "tCO₂/MWh", source: "US EPA  2021" },
    UK: { factor: 0.22, unit: "tCO₂/MWh", source: "UK BEIS 2023" },
    DE: { factor: 0.38, unit: "tCO₂/MWh", source: "UBA Germany 2022" },
    FR: { factor: 0.06, unit: "tCO₂/MWh", source: "RTE France 2022" }
  };

  getCountryConstants(countryCode: string) {
    return this.gridEmissionFactorsByCountry[countryCode] || this.gridEmissionFactorsByCountry["US"];
  }
}
