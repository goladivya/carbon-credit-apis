import { PRECISION } from "../calculator";
import { TransmissionCreationRequest } from "../requests/transmissionCreationRequest";

const convert = require("convert-units");

export class TransmissionLossCal {
    public static calculate(req: TransmissionCreationRequest ): number {
        const constants = req.transmissionConstants;

        // Calculate energy loss
        const loss = req.totalGenerated - req.totalDelivered;
        if (loss < 0) throw new Error("Delivered energy cannot exceed generated energy.");

        const emissionUnit = constants.gridEmissionFactorUnit.split('/')[1];
        console.log(`Converting loss: ${loss} from ${req.unit} to ${emissionUnit}`);
        const convertedLoss = convert(loss).from(req.unit).to(emissionUnit);

        const emission = convertedLoss * constants.gridEmissionFactor;
        return Number(emission.toFixed(PRECISION));
    }
}
