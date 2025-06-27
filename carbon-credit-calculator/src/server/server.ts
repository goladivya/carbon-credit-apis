import express from "express";
import type { Request, Response } from "express";
import path from "path";

import {
  calculateCredit,
  SolarCreationRequest,
  ThermalCreationRequest,
  HydroCreationRequest,
  TransmissionCreationRequest,
  TransportationCreationRequest,
  SolarConstants,
  HydroConstant,
  ThermalConstants,
  TransmissionConstants,
  TransportationConstant,
  SolarCal
} from "../index";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

// Tree Offset Calculator
function calculateTreesNeeded(emissions: number, years = 10): number {
  const offsetPerTreePerYear = 0.022;
  const totalPerTree = offsetPerTreePerYear * years;
  return Math.ceil(emissions / totalPerTree);
}

// Offset Project Suggestions
function getSuggestedProjects(type: string) {
  const commonProjects = [
    {
      name: "Tree Plantation Program",
      type: "Afforestation",
      region: "Global",
      description: "Plant trees to offset carbon emissions"
    },
    {
      name: "Clean Cookstove Initiative",
      type: "Energy Efficiency",
      region: "Asia",
      description: "Distributes fuel-efficient stoves to rural families"
    },
    {
      name: "Solar Mini-Grids",
      type: "Renewable Energy",
      region: "India",
      description: "Brings solar power to off-grid villages"
    }
  ];
  return commonProjects.filter(p =>
    type.toLowerCase().includes("transportation") ? p.type !== "Renewable Energy" : true
  );
}

// Carbon Price Mapping
const carbonPricePerTon: { [currency: string]: number } = {
  USD: 15,
  INR: 1245,
  EUR: 14,
  GBP: 13
};

app.post("/api/calculate", (req: Request, res: Response): void => {
  const { type, data, currency = "USD" } = req.body;

  try {
    let requestObj: any;
    let emissionInfo = {
      emissionFactor: 0,
      unit: "",
      source: "",
      category: ""
    };

    switch (type) {
      case "solar": {
        const solarConst = new SolarConstants();

        if (Array.isArray(data)) {
          const requests: SolarCreationRequest[] = data.map((item: any) => {
            const req = new SolarCreationRequest();
            Object.assign(req, item);
            req.solarConstants = solarConst;
            return req;
          });

          const result = SolarCal.calculateMultiple(requests);
          const trees = calculateTreesNeeded(result.totalCredit);
          const suggestions = getSuggestedProjects(type);

          res.json({
            result,
            emissionFactor: solarConst.highEmissionFactor,
            unit: solarConst.emissionFactorUnit,
            source: "IPCC",
            category: "Electricity",
            trees_needed_to_offset: trees,
            suggested_offset_projects: suggestions,
            offset_cost_to_neutralize: Number(
              (result.totalCredit * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
            ),
            currency
          });
          return;
        } else {
          requestObj = new SolarCreationRequest();
          Object.assign(requestObj, data);
          requestObj.solarConstants = solarConst;

          emissionInfo = {
            emissionFactor: solarConst.highEmissionFactor,
            unit: solarConst.emissionFactorUnit,
            source: "IPCC",
            category: "Electricity"
          };
        }
        break;
      }

      case "thermal": {
        requestObj = new ThermalCreationRequest();
        Object.assign(requestObj, data);
        const thermalConst = new ThermalConstants();
        requestObj.ThermalConstants = thermalConst;

        const thermalFactor = thermalConst.emissionFactors[data.fuelType];
        if (!thermalFactor) throw new Error("Invalid fuel type for thermal.");

        emissionInfo = {
          emissionFactor: thermalFactor.factor,
          unit: `kg CO₂ per ${thermalFactor.unit}`,
          source: "IPCC 2023",
          category: "Electricity"
        };
        break;
      }

      case "hydro": {
        requestObj = new HydroCreationRequest();
        Object.assign(requestObj, data);
        const hydroConst = new HydroConstant();
        requestObj.hydroConstant = hydroConst;

        emissionInfo = {
          emissionFactor: hydroConst.emissionFactor,
          unit: hydroConst.emissionFactorUnit,
          source: "IPCC",
          category: "Electricity"
        };
        break;
      }

      case "transmission": {
        requestObj = new TransmissionCreationRequest();
        Object.assign(requestObj, data);
        const transmissionConst = new TransmissionConstants();
        requestObj.transmissionConstants = transmissionConst;

        emissionInfo = {
          emissionFactor: transmissionConst.gridEmissionFactor,
          unit: transmissionConst.gridEmissionFactorUnit,
          source: "GHG Protocol",
          category: "Electricity"
        };
        break;
      }

      case "transportation": {
        const transportConst = new TransportationConstant();

        if (Array.isArray(data)) {
          const requests = data.map((entry: any) => {
            const req = new TransportationCreationRequest();
            Object.assign(req, entry);
            req.transportationconstants = transportConst;
            return req;
          });

          const total = requests.reduce((acc, req) => acc + calculateCredit(req), 0);
          const breakdown = requests.map((req, index) => {
            const factor = transportConst.emissionFactors[req.vehicleType];
            return {
              index,
              vehicleType: req.vehicleType,
              fuelUsed: req.fuelUsed,
              emissionFactor: factor,
              emissionReduction: calculateCredit(req)
            };
          });

          const trees = calculateTreesNeeded(total);
          const suggestions = getSuggestedProjects(type);
          const emissionFactorsUsed = Object.fromEntries(
            requests.map(req => [req.vehicleType, transportConst.emissionFactors[req.vehicleType]])
          );

          res.json({
            result: {
              totalCredit: Number(total.toFixed(2)),
              breakdown
            },
            emissionFactorsUsed,
            unit: "kg CO₂/l",
            source: "IPCC / Transport Guidelines",
            category: "Transport",
            trees_needed_to_offset: trees,
            suggested_offset_projects: suggestions,
            offset_cost_to_neutralize: Number(
              (total * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
            ),
            currency
          });
          return;
        } else {
          const req = new TransportationCreationRequest();
          Object.assign(req, data);
          req.transportationconstants = transportConst;

          const singleResult = calculateCredit(req);
          const trees = calculateTreesNeeded(singleResult);
          const suggestions = getSuggestedProjects(type);

          res.json({
            result: singleResult,
            emissionFactor: transportConst.emissionFactors[req.vehicleType],
            unit: "kg CO₂/l",
            source: "IPCC",
            category: "Transport",
            trees_needed_to_offset: trees,
            suggested_offset_projects: suggestions,
            offset_cost_to_neutralize: Number(
              (singleResult * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
            ),
            currency
          });
          return;
        }
      }

      default:
        throw new Error("Invalid type");
    }

    const result = calculateCredit(requestObj);
    const trees = calculateTreesNeeded(result);
    const suggestions = getSuggestedProjects(type);

    res.json({
      result,
      ...emissionInfo,
      trees_needed_to_offset: trees,
      suggested_offset_projects: suggestions,
      offset_cost_to_neutralize: Number(
        (result * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
      ),
      currency
    });

  } catch (err: any) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3050;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
