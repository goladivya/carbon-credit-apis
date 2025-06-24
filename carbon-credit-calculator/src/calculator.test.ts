//import { describe } from "node:test";
import { calculateCredit } from "./calculator";
import { AgricultureCreationRequest } from "./requests/agricultureCreationRequest";
import { SolarCreationRequest } from "./requests/solarCreationRequest";
import { ThermalCreationRequest } from "./requests/thermalCreationRequest";
import { HydroCreationRequest } from "./requests/hydroCreationRequest";
import { TransmissionCreationRequest } from "./requests/transmissionCreationRequest";
import { TransportationCreationRequest } from "./requests/transportationCreationRequests"

describe("Agriculture calculation", () => {
    it("example", () => {
        const req = new AgricultureCreationRequest();
        req.duration = 120
        req.durationUnit = 'd'
        req.landArea = 16
        req.landAreaUnit = 'ha'
        expect(calculateCredit(req)).toBe(88.32);
    });

    it("km2 test", () => {
        const req = new AgricultureCreationRequest();
        req.duration = 120
        req.durationUnit = 'd'
        req.landArea = 0.16
        req.landAreaUnit = 'km2'
        expect(calculateCredit(req)).toBe(88.32);
    });

    it("hours test", () => {
        const req = new AgricultureCreationRequest();
        req.duration = 2880
        req.durationUnit = 'h'
        req.landArea = 0.16
        req.landAreaUnit = 'km2'
        expect(calculateCredit(req)).toBe(88.32);
    });

    it("example 2", () => {
        const req = new AgricultureCreationRequest();
        req.duration = 365
        req.durationUnit = 'd'
        req.landArea = 50
        req.landAreaUnit = 'ha'
        expect(calculateCredit(req)).toBe(839.50);
    });

    it("test error", () => {
        const req = new AgricultureCreationRequest();
        req.duration = 365
        req.durationUnit = 'd'
        req.landArea = 50
        req.landAreaUnit = 'ha'
        req.agricultureConstants.emissionFactorUnit = "km"
        expect(() => calculateCredit(req)).toThrow("Invalid emission factor unit km");
    });
});

describe("Solar calculation", () => {
    it("example1", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 20
        req.energyGenerationUnit = 'kWh/year/unit'
        req.buildingType = 'Household'
        expect(calculateCredit(req)).toBe(0.14);
    });

    it("example1 MWh", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 0.020
        req.energyGenerationUnit = 'MWh/year/unit'
        req.buildingType = 'Household'
        expect(calculateCredit(req)).toBe(0.14);
    });

    it("example2", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 105
        req.energyGenerationUnit = 'kWh/year/unit'
        req.buildingType = 'Household'
        expect(calculateCredit(req)).toBe(0.44);
    });

    it("example2 MWh", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 0.105
        req.energyGenerationUnit = 'MWh/year/unit'
        req.buildingType = 'Household'
        expect(calculateCredit(req)).toBe(0.44);
    });

    it("example1 error", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 20
        req.energyGenerationUnit = 'kWh/year/unit'
        req.buildingType = 'Household'
        req.solarConstants.emissionFactorUnit = "m"
        expect(() => calculateCredit(req)).toThrow("Invalid emission factor unit m");
    });

    it("example1 error 2", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 20
        req.buildingType = 'Household'
        req.energyGenerationUnit = 'km'
        expect(() => calculateCredit(req)).toThrow("Invalid measured unit km");
    });

    it("example1 error build type", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 20
        req.buildingType = 'TestType'
        req.energyGenerationUnit = 'kWh/year/unit'
        expect(() => calculateCredit(req)).toThrow("Invalid building type TestType");
    });

    it("Rounding issue fix", () => {
        const req = new SolarCreationRequest();
        req.energyGeneration = 8520000000
        req.buildingType = 'TestType'
        req.solarConstants.buildingTypes = {
            'TestType': 825
        };
        req.energyGenerationUnit = 'Wh/year/unit'
        expect(calculateCredit(req)).toBe(11080.54);
    });
});

describe("Thermal Calculation", () => {
    it("emission for coal(kg)", () => {
        const req = new ThermalCreationRequest();
        req.fuelAmount = 100;
        req.fuelType = "coal";
        req.fuelUnit = "kg";

        expect(calculateCredit(req)).toBe(242);

    });

    it("emission for nat_gas(m3)", () => {
        const req = new ThermalCreationRequest();
        req.fuelAmount = 10;
        req.fuelType = "natural_gas";
        req.fuelUnit = "m3";

        expect(calculateCredit(req)).toBe(19.00);

    });

    it("error for unsupported fuel", () => {
        const req = new ThermalCreationRequest();
        req.fuelAmount = 10;
        req.fuelType = "wood";
        req.fuelUnit = "kg";

        expect(() => calculateCredit(req)).toThrow("Unsupported fuel type: wood");

    });

    it("error for unsupported unit", () => {
        const req = new ThermalCreationRequest();
        req.fuelAmount = 10;
        req.fuelType = "coal";
        req.fuelUnit = "m3";

        expect(() => calculateCredit(req)).toThrow("Failed to convert from m3 to kg");

    });

    it("emission for diesel(l)", () => {
        const req = new ThermalCreationRequest();
        req.fuelAmount = 100;
        req.fuelType = "diesel";
        req.fuelUnit = "l";

        expect(calculateCredit(req)).toBe(268);

    });


});


describe("Hydro Emission Calculation", () => {
    it("emission for 5km2 over 1 year", () => {
        const req = new HydroCreationRequest();
        req.reservoirArea = 5;
        req.areaUnit = "km2";
        req.duration = 1;
        req.durationUnit = "year";

        expect(calculateCredit(req)).toBe(7500);
    });

    it("emission for 2km2 over 3 year", () => {
        const req = new HydroCreationRequest();
        req.reservoirArea = 2;
        req.areaUnit = "km2";
        req.duration = 3;
        req.durationUnit = "year";

        expect(calculateCredit(req)).toBe(9000);
    });


    it("error for unsupported unit", () => {
        const req = new HydroCreationRequest();
        req.reservoirArea = 5;
        req.areaUnit = "km2";
        req.duration = 1;
        req.durationUnit = "year";

        req.hydroConstant.emissionFactorUnit = "tCO2peryear";

        expect(() => calculateCredit(req)).toThrow("Invalid emission factor unit format");

    });


});

describe("TransmissionLosses", () => {

    it("emission for MWH unit", () => {
        const req = new TransmissionCreationRequest();
        req.totalDelivered = 80;
        req.totalGenerated = 100;
        req.unit = "MWh";
        req.transmissionConstants = {
            gridEmissionFactor: 0.82,
            gridEmissionFactorUnit: "tCO2/MWh"
        };

        expect(calculateCredit(req)).toBe(16.40)
    });

    it("emission for kWH unit", () => {
        const req = new TransmissionCreationRequest();
        req.totalGenerated = 100000;
        req.totalDelivered = 90000;
        req.unit = "kWh";
        req.transmissionConstants = {
            gridEmissionFactor: 0.82,
            gridEmissionFactorUnit: "tCO2/MWh"
        };

        expect(calculateCredit(req)).toBe(8.20)
    });

    it("should throw an error when delivered > generated", () => {
        const req = new TransmissionCreationRequest();
        req.totalGenerated = 80;
        req.totalDelivered = 100;
        req.unit = "MWh";
        req.transmissionConstants = {
            gridEmissionFactor: 0.164,
            gridEmissionFactorUnit: "kg/kWh"
        };



        expect(() => calculateCredit(req)).toThrow("Delivered energy cannot exceed generated energy.");
    });

    it("should throw error for invalid unit conversion", () => {
        const req = new TransmissionCreationRequest();
        req.totalGenerated = 100;
        req.totalDelivered = 90;
        req.unit = "km";
        req.transmissionConstants = {
            gridEmissionFactor: 0.164,
            gridEmissionFactorUnit: "kg/kWh"
        };

        expect(() => calculateCredit(req)).toThrow("Cannot convert incompatible measures");
    });



});

describe("Transportation losses", () => {
    it("basic test case", () => {
        const req = new TransportationCreationRequest();
        req.fuelUsed = 100;
        req.fuelUnit = "l";

        expect(calculateCredit(req)).toBe(231.00);

    });


    it("zero fuel usage", () => {
        const req = new TransportationCreationRequest();
        req.fuelUsed = 0;
        req.fuelUnit = "l";

        expect(calculateCredit(req)).toBe(0.00);
    });

    it("should throw error for negative fuel usage", () => {
        const req = new TransportationCreationRequest();
        req.fuelUsed = -50;
        req.fuelUnit = "l";

        expect(() => calculateCredit(req)).toThrow("Fuel used cannot be negative");
    });

    it("should throw error for unsupported unit", () => {
        const req = new TransportationCreationRequest();
        req.fuelUsed = 50;
        req.fuelUnit = "kg"; // unsupported in this context

        expect(() => calculateCredit(req)).toThrow("Invalid fuel unit provided or conversion failed");
    });
})