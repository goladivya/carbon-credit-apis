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
  const { type, data, countryCode = "US" } = req.body;

  const countryToCurrency: Record<string, string> = {
    IN: "INR",
    US: "USD",
    UK: "GBP",
    DE: "EUR",
    FR: "EUR",

  };
  const currency = countryToCurrency[countryCode] || "USD";

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
        const emissionInfoFromConst = solarConst.getEmissionInfo(countryCode);

        if (Array.isArray(data)) {
          const requests: SolarCreationRequest[] = data.map((item: any) => {
            const req = new SolarCreationRequest();
            Object.assign(req, item);
            req.emissionFactor = emissionInfoFromConst.emissionFactor;
            req.thresholdUnit = solarConst.thresholdUnit;
            req.buildingTypes = solarConst.buildingTypes;
            return req;
          });

          const result = SolarCal.calculateMultiple(requests);
          const trees = calculateTreesNeeded(result.totalCredit);
          const suggestions = getSuggestedProjects(type);
          const currency = countryToCurrency[countryCode] || "USD";

          res.json({
            result,
            emissionFactor: emissionInfoFromConst.emissionFactor,
            unit: emissionInfoFromConst.emissionFactorUnit,
            source: emissionInfoFromConst.source,
            breakdown: result.breakdown,
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
          const result = calculateCredit(requestObj);
          const trees = calculateTreesNeeded(result);
          const suggestions = getSuggestedProjects(type);
          const currency = countryToCurrency[countryCode] || "USD";

          res.json({
            result,
            emissionFactor: emissionInfoFromConst.emissionFactor,
            unit: emissionInfoFromConst.emissionFactorUnit,
            source: emissionInfoFromConst.source,
            category: "Electricity",
            trees_needed_to_offset: trees,
            suggested_offset_projects: suggestions,
            offset_cost_to_neutralize: Number(
              (result * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
            ),
            currency
          });
          return;
        }
      }
      case "thermal": {
        const thermalConst = new ThermalConstants();
        const thermalFactor = thermalConst.getEmissionFactor(data.fuelType, countryCode);
        if (!thermalFactor) throw new Error("Invalid fuel type for thermal.");

        requestObj = new ThermalCreationRequest();
        Object.assign(requestObj, data);
        requestObj.emissionFactor = thermalFactor.factor;
        requestObj.expectedUnit = thermalFactor.unit;
        requestObj.source = thermalFactor.source;

        const result = calculateCredit(requestObj);
        const trees = calculateTreesNeeded(result);
        const suggestions = getSuggestedProjects(type);

        res.json({
          result,
          emissionFactor: thermalFactor.factor,
          unit: `kg CO₂ per ${thermalFactor.unit}`,
          source: thermalFactor.source,
          category: "Electricity",
          trees_needed_to_offset: trees,
          suggested_offset_projects: suggestions,
          offset_cost_to_neutralize: Number(
            (result * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
          ),
          currency
        });
        return;
      }

      case "hydro": {
        const hydroConst = new HydroConstant();

        const countryConstants = hydroConst.getCountryConstants(countryCode);

        requestObj = new HydroCreationRequest();
        Object.assign(requestObj, data);

        requestObj.hydroConstant = {
          factor: countryConstants.factor,
          unit: countryConstants.unit,
          source: countryConstants.source,

        };

        emissionInfo = {
          emissionFactor: countryConstants.factor,
          unit: countryConstants.unit,
          source: countryConstants.source,
          category: "Hydro"
        }
        break;
      }


      case "transmission": {
        requestObj = new TransmissionCreationRequest();
        Object.assign(requestObj, data);
        requestObj.countryCode = countryCode;

        // Set constants and country emission data
        requestObj.transmissionConstants = new TransmissionConstants();
        const countryConstants = requestObj.transmissionConstants.getCountryConstants(countryCode);


        const result = calculateCredit(requestObj);
        const trees = calculateTreesNeeded(result);
        const suggestions = getSuggestedProjects(type);

        res.json({
          result,
          emissionFactor: countryConstants.factor,
          unit: countryConstants.unit,
          source: countryConstants.source,
          category: "Electricity",
          trees_needed_to_offset: trees,
          suggested_offset_projects: suggestions,
          offset_cost_to_neutralize: Number(
            (result * (carbonPricePerTon[currency] || carbonPricePerTon["USD"])).toFixed(2)
          ),
          currency
        });
        return;
      }

      case "transportation": {
        const transportConst = new TransportationConstant();
        const countryConstants = transportConst.getCountryConstants(countryCode);

        if (Array.isArray(data)) {
          const requests = data.map((entry: any) => {
            const req = new TransportationCreationRequest();
            Object.assign(req, entry);
            req.transportationconstants = {
              emissionFactors: countryConstants.emissionFactors,
              fuelEmissionUnit: countryConstants.fuelEmissionUnit,
              source: countryConstants.source,
              year: countryConstants.year
            };
            return req;
          });

          const total = requests.reduce((acc, req) => acc + calculateCredit(req), 0);
          const breakdown = requests.map((req, index) => {
            const factor = req.transportationconstants.emissionFactors[req.vehicleType];
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
            requests.map(req => [req.vehicleType, req.transportationconstants.emissionFactors[req.vehicleType]])
          );

          res.json({
            result: {
              totalCredit: Number(total.toFixed(2)),
              breakdown
            },
            emissionFactorsUsed,
            unit: countryConstants.fuelEmissionUnit,
            source: countryConstants.source,
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
          req.transportationconstants = {
            emissionFactors: countryConstants.emissionFactors,
            fuelEmissionUnit: countryConstants.fuelEmissionUnit,
            source: countryConstants.source,
            year: countryConstants.year
          };

          const singleResult = calculateCredit(requestObj);
          const trees = calculateTreesNeeded(singleResult);
          const suggestions = getSuggestedProjects(type);

          res.json({
            result: singleResult,
            emissionFactor:requestObj.transportationconstants.emissionFactors[requestObj.vehicleType],
            unit: countryConstants.fuelEmissionUnit,
            source: countryConstants.source,
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



app.get("/api/v1/docs", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Documentation - Carbon Calculator</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: auto;
          background: #f9f9f9;
          color: #333;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        pre {
          background: #eee;
          padding: 10px;
          overflow: auto;
        }
        code {
          font-family: Consolas, monospace;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>🌍 Carbon Credit Calculator API - v1</h1>
      <p>This API allows you to calculate carbon credits for various sectors including Solar, Thermal, Hydro, Transmission, and Transportation.</p>
      
      <h2>🚀 Endpoint</h2>
      <pre><code>POST /api/v1/calculate</code></pre>

      <h3>🔧 Request Format</h3>
      <pre><code>{
  "type": "solar" | "thermal" | "hydro" | "transmission" | "transportation",
  "data": { ...sectorSpecificInput },
  "countryCode": "US" | "IN" | "UK" | "DE" | "FR"
}</code></pre>

      <h3>📦 Sample cURL</h3>
      <pre><code>curl -X POST http://localhost:3050/api/v1/calculate \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "solar",
    "data": {
      "buildingType": "residential",
      "energyGeneration": 1000,
      "energyGenerationUnit": "kWh/year/unit"
    },
    "countryCode": "US"
  }'</code></pre>

      <h3>🔐 Auth & Rate Limits</h3>
      <p>Currently, no authentication is required. Rate limiting is not enforced in development but should be added in production (e.g., using <code>express-rate-limit</code>).</p>

      <h3>📑 Response</h3>
      <pre><code>{
  "result": 1.24,
  "emissionFactor": 0.45,
  "unit": "kgCO₂/kWh",
  "source": "US EPA 2021",
  ...
}</code></pre>

      <h3>📈 Versioning</h3>
      <p>All endpoints are prefixed with <code>/api/v1</code>. Future versions will be available at <code>/api/v2</code>, etc.</p>

      <h3>🆕 Changelog</h3>
      <ul>
        <li><strong>v1.0.0</strong>: Initial release with all core calculators.</li>
        <li><strong>v1.1.0</strong>: Added documentation and versioning.</li>
      </ul>
    </body>
    </html>
  `;
  res.send(html);
});


const PORT = 3050;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
// For testing purposes, you can use tools like Postman or cURL to send POST requests to this server.
// Example request body for solar:
// {
//   "type": "solar",
//   "data": {
//     "buildingType": "residential",
//     "energyGeneration": 1000,
//     "energyGenerationUnit": "kWh/year/unit"
//   },
//   "countryCode": "US"
// }
// Example request body for thermal:
// {
//   "type": "thermal",
//   "data": {
//     "fuelType": "coal",
//     "fuelAmount": 100,
//     "fuelUnit": "kg",
//     "countryCode": "IN"
//   }

// }

