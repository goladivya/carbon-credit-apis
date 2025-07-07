import { PRECISION } from "../calculator";
import { SolarCreationRequest } from "../requests/solarCreationRequest";

const convert = require("convert-units");

export class SolarCal {
  public static calculate(req: SolarCreationRequest): number {
    const emissionUnitParts = "tCO2/MWh".split("/");
    const measuredUnitParts = req.energyGenerationUnit.split("/");

    if (measuredUnitParts.length !== 3) {
      throw Error("Invalid measured unit " + req.energyGenerationUnit);
    }

    let threshold = req.buildingTypes[req.buildingType];
    if (!threshold) {
      throw Error("Invalid building type " + req.buildingType);
    }

    // Convert threshold if unit is different
    if (req.energyGenerationUnit !== req.thresholdUnit) {
      const thresholdUnitParts = req.thresholdUnit.split("/");
      let factor =
        convert(1).from(thresholdUnitParts[0]).to(measuredUnitParts[0]) /
        convert(1).from(thresholdUnitParts[1]).to(measuredUnitParts[1]);
      threshold = threshold * factor;
    }

    const unitX = convert(1).from(measuredUnitParts[0]).to(emissionUnitParts[1]);
    const highFactor = req.emissionFactor * unitX;
    const lowFactor = req.emissionFactor * 0.25 * unitX;

    let value: number;
    if (req.energyGeneration < threshold) {
      value = req.energyGeneration * highFactor;
    } else {
      value = threshold * highFactor + (req.energyGeneration - threshold) * lowFactor;
    }

    return Number(value.toFixed(PRECISION));
  }

  public static calculateMultiple(
    requests: SolarCreationRequest[]
  ): {
    totalCredit: number;
    breakdown: {
      index: number;
      buildingType: string;
      energyGeneration: number;
      emissionReduction: number;
    }[];
  } {
    let totalCredit = 0;

    const breakdown = requests.map((request, index) => {
      const emissionReduction = SolarCal.calculate(request);
      totalCredit += emissionReduction;

      return {
        index,
        buildingType: request.buildingType,
        energyGeneration: request.energyGeneration,
        emissionReduction
      };
    });

    return {
      totalCredit: Number(totalCredit.toFixed(PRECISION)),
      breakdown
    };
  }
}
