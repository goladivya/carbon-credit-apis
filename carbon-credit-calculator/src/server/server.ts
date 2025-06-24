import express from "express";
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


} from "../index"; // ⬅ clean import from index.ts

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

app.post("/api/calculate", (req, res) => {
  const { type, data } = req.body;

  console.log("Incoming type:", type);
  console.log("Incoming data:", data);

  try {
    let requestObj;

    switch (type) {
      case "solar":
        requestObj = new SolarCreationRequest();
        Object.assign(requestObj, data);
        requestObj.solarConstants = new SolarConstants(); 
        break;
      case "thermal":
        requestObj = new ThermalCreationRequest();
        Object.assign(requestObj, data);
        requestObj.ThermalConstants = new ThermalConstants();
        break;
      case "hydro":
        requestObj = new HydroCreationRequest();
        Object.assign(requestObj, data);
        requestObj.hydroConstant = new HydroConstant();
        break;
      case "transmission":
        requestObj = new TransmissionCreationRequest();
        Object.assign(requestObj, data);
        requestObj.transmissionConstants = new TransmissionConstants();
        break;
      case "transportation":
        requestObj = new TransportationCreationRequest();
        Object.assign(requestObj, data);
        requestObj.transportationconstants = new TransportationConstant();
        break;
      default:
        throw new Error("Invalid type");
    }

    console.log("Request object:", requestObj);

    const result = calculateCredit(requestObj);
    console.log("Result:", result);

    res.json({ result });

  } catch (err: any) {
    console.error(" Error occurred:", err);
    res.status(500).json({ error: err.message });
  }
});



const PORT = 3050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
