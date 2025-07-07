export class SolarConstants {
  // Unit for threshold comparison
  thresholdUnit: string = "kWh/year";

  // Building-type-based generation thresholds
  buildingTypes: { [k: string]: number } = {
    Household: 55,
    HealthCenter: 825,
    Dispensary: 825,
    School: 275,
    PrimarySchool: 275,
    SecondarySchool: 275,
    PublicAdministration: 55,
    TradingPlace: 825,
    BusStop: 200
  };

  // Country-wise emission factors (in tCO2/MWh)
  emissionFactorsByCountry: {
    [countryCode: string]: {
      value_tco2_per_mwh: number;
      source: string;
      updated: string;
      range: { low: number; high: number };
    };
  } = {
    IN: {
      value_tco2_per_mwh: 0.82,
      source: "CEA",
      updated: "2023-06",
      range: { low: 0.45, high: 0.94 }
    },
    UK: {
      value_tco2_per_mwh: 0.233,
      source: "DEFRA",
      updated: "2023-07",
      range: { low: 0.05, high: 0.45 }
    },
    US: {
      value_tco2_per_mwh: 0.418,
      source: "EPA",
      updated: "2023-03",
      range: { low: 0.3, high: 0.7 }
    },
    DEFAULT: {
      value_tco2_per_mwh: 0.475,
      source: "IPCC",
      updated: "2019-01",
      range: { low: 0.2, high: 0.9 }
    }
  };


  getEmissionInfo(countryCode: string) {
  const info =
    this.emissionFactorsByCountry[countryCode.toUpperCase()] ||
    this.emissionFactorsByCountry["DEFAULT"];

  return {
    emissionFactor: info.value_tco2_per_mwh,
    lowEmissionFactor: info.range.low,
    highEmissionFactor: info.range.high,
    emissionFactorUnit: "tCO₂/MWh",
    source: info.source,
    updated: info.updated
  };
}

}
