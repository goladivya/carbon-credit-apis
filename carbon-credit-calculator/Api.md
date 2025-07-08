### Base Url


### Authentication
Currently Open Access (no API key required).


### Request Format 
{
  "type": "solar" | "thermal" | "hydro" | "transmission" | "transportation",
  "data": Object or Array of Objects (sector-specific),
  "countryCode": "IN" | "US" | "UK" | "FR" | "DE"  // optional
}


### Examples Paylaod and Responses

#### Solar:-
###### Request
```
{
  "type": "solar",
  "data": {
    "buildingType": "residential",
    "energyGeneration": 1000,
    "energyGenerationUnit": "kWh/year/unit"
  },
  "countryCode": "IN"
}
```

###### Response:-
```
{

  "result": 0.45,
  "emissionFactor": 0.00045,
  "unit": "kgCO₂/kWh",
  "source": "CEA India 2023",
  "category": "Electricity",
  "trees_needed_to_offset": 3,
  "suggested_offset_projects": [...],
  "offset_cost_to_neutralize": 560.25,
  "currency": "INR"
}
```

#### Thermal:-
###### Request
```

{
  "type": "thermal",
  "data": {
    "fuelType": "coal",
    "fuelAmount": 200,
    "fuelUnit": "kg"
  },
  "countryCode": "US"
}
```

###### Response
```
{
  "result": 0.78,
  "emissionFactor": 3.9,
  "unit": "kg CO₂ per kg",
  "source": "US EPA 2022",
  "category": "Electricity",
  "trees_needed_to_offset": 4,
  "suggested_offset_projects": [...],
  "offset_cost_to_neutralize": 11.7,
  "currency": "USD"
}
```


#### Hydro:-
###### Request
```

{
  "type": "hydro",
  "data": {
    "hydroGenerated": 500,
    "unit": "MWh"
  },
  "countryCode": "FR"
}
```

###### Responses-
```
{
  "result": 0.03,
  "emissionFactor": 0.06,
  "unit": "tCO₂/MWh",
  "source": "RTE France 2022",
  "category": "Hydro",
  "trees_needed_to_offset": 2,
  "suggested_offset_projects": [...],
  "offset_cost_to_neutralize": 0.42,
  "currency": "EUR"
}
```


#### Transmission :-

###### Request
```
{
  "type": "transmission",
  "data": {
    "totalGenerated": 200,
    "totalDelivered": 180,
    "unit": "MWh"
  },
  "countryCode": "DE"
}
```

###### Responses
```
{
  "result": 7.6,
  "emissionFactor": 0.38,
  "unit": "tCO₂/MWh",
  "source": "UBA Germany 2022",
  "category": "Electricity",
  "trees_needed_to_offset": 35,
  "suggested_offset_projects": [...],
  "offset_cost_to_neutralize": 106.4,
  "currency": "EUR"
}
```


#### Transportation:-

###### Request
```

{
  "type": "transportation",
  "data": {
    "vehicleType": "petrol_car",
    "fuelUsed": 50,
    "fuelUnit": "l"
  },
  "countryCode": "UK"
}
```

###### Responses
```

{
  "result": 0.11,
  "emissionFactor": 2.29,
  "unit": "kgCO₂/l",
  "source": "UK BEIS 2023",
  "category": "Transport",
  "trees_needed_to_offset": 1,
  "suggested_offset_projects": [...],
  "offset_cost_to_neutralize": 1.54,
  "currency": "GBP"
}
```

Errors:-
| HTTP Code | Description                       |
| --------- | --------------------------------- |
| `400`     | Invalid `type` or malformed input |
| `422`     | Missing required fields           |
| `500`     | Server error / calculator failure |
