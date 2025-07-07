import { PRECISION } from "../calculator";
import { TransmissionCreationRequest } from "../requests/transmissionCreationRequest";

const convert = require("convert-units");

export class TransmissionLossCal {
  public static calculate(req: TransmissionCreationRequest): number {
    const constants = req.transmissionConstants;
    const countryData = constants.getCountryConstants(req.countryCode);

    const loss = req.totalGenerated - req.totalDelivered;
    if (loss < 0) throw new Error("Delivered energy cannot exceed generated energy.");

    const emissionUnit = countryData.unit.split("/")[1];
    const convertedLoss = convert(loss).from(req.unit).to(emissionUnit);

    const emission = convertedLoss * countryData.factor;
    return Number(emission.toFixed(PRECISION));
  }
}
