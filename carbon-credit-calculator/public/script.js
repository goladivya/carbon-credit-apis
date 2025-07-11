const form = document.getElementById("inputForm");
const resultDiv = document.getElementById("result");
const emissionInfoDiv = document.getElementById("emission-info");

const unitGuidelines = {
  solar: `
        <p><strong>Energy Generation:</strong> Enter in kWh/year</p>
        <p><strong>Unit:</strong> Should be "kWh/year/unit" or "Mwh/year/unit</p>
          <p><strong>Building Type:</strong> Select the building type that best describes where the solar system is installed. Each type represents an assumed average energy consumption per unit, which affects the carbon credit calculation.</p>
    <ul>
      <li><strong>Household</strong>: 55 kWh/year — Residential units or homes.</li>
      <li><strong>HealthCenter</strong>: 825 kWh/year — Larger healthcare facilities offering inpatient or 24-hour care.</li>
      <li><strong>Dispensary</strong>: 825 kWh/year — Small medical centers providing outpatient services.</li>
      <li><strong>School</strong>: 275 kWh/year — General education institutions.</li>
      <li><strong>PrimarySchool</strong>: 275 kWh/year — Schools serving primary-grade students.</li>
      <li><strong>SecondarySchool</strong>: 275 kWh/year — Schools serving secondary-grade students.</li>
      <li><strong>PublicAdministration</strong>: 55 kWh/year — Government offices, municipal buildings.</li>
      <li><strong>TradingPlace</strong>: 825 kWh/year — Markets or commercial hubs.</li>
      <li><strong>BusStop</strong>: 200 kWh/year — Electrified public transport stops (e.g., with lighting, signage).</li>
    </ul>`
,
  thermal: `<p><strong>Fuel Amount:</strong> Enter amount of fuel in liters</p> `,
  hydro: `<p><strong>Reservoir Area:</strong> Use in square kilometers (km2)</p>`,
  transmission: `<p><strong>Total Generated & Delivered:</strong> Use in kWh</p>`,
  transportation: `<p><strong>Fuel Used:</strong> Enter total fuel consumption in liters and select the vehicle type</p> <p><strong>Vehicle Type:</strong> Choose the appropriate category:</p>
  <ul>
    <li><strong>petrol_car</strong>: 2.31 kg CO₂/l – Gasoline-based cars.</li>
    <li><strong>motorcycle</strong>: 2.31 kg CO₂/l – Two-wheelers (petrol).</li>
    <li><strong>bus</strong>: 2.68 kg CO₂/l – Public transport buses (diesel).</li>
    <li><strong>truck</strong>: 2.68 kg CO₂/l – Commercial freight trucks (diesel).</li>
  </ul>
  <p><strong>Source:</strong> Based on IPCC Transportation Emission Guidelines.</p>`
};

function showUnitInfo() {
  const selected = document.getElementById("calcType").value;
  const modal = document.getElementById("unitModal");
  const info = document.getElementById("unitInfoText");
  const closeBtn = document.getElementById("closeModal");

  if (!selected) {
    alert("Please select a type first.");
    return;
  }

  info.innerHTML = unitGuidelines[selected] || "<p>No info available.</p>";
  modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

const fieldTemplates = {
  solar: [
    { name: "energyGeneration", type: "number", label: "Energy Generation (kWh/year)" },
    { name: "energyGenerationUnit", type: "text", value: "kWh/year/unit", label: "Unit" },
    { name: "buildingType", type: "select", label: "Building Type", options: ["Household", "HealthCenter", "Dispensary", "School", "PrimarySchool", "SecondarySchool", "PublicAdministration", "TradingPlace", "BusStop"] }
  ],
  thermal: [
    { name: "fuelType", type: "select", label: "Fuel Type", options: ["coal", "diesel", "natural_gas"] },
    { name: "fuelAmount", type: "number", label: "Fuel Amount" },
    { name: "fuelUnit", type: "text", value: "kg", label: "Unit (kg/l/m³)" }
  ],
  hydro: [
    { name: "reservoirArea", type: "number", label: "Reservoir Area (km²)" },
    { name: "areaUnit", type: "text", value: "km2", label: "Area Unit" },
    { name: "duration", type: "number", value: 0, label: "Duration (years)" },
    { name: "durationUnit", type: "text", value: "year", label: "Duration Unit" }
  ],
  transmission: [
    { name: "totalGenerated", type: "number", label: "Total Generated Energy (kWh)" },
    { name: "totalDelivered", type: "number", label: "Total Delivered Energy (kWh)" },
    { name: "unit", type: "text", value: "kWh", label: "Unit" }
  ],
  transportation: [
    { name: "vehicleType", type: "select", label: "Vehicle Type", options: ["petrol_car", "bus", "truck", "motorcycle"] },
    { name: "fuelUsed", type: "number", label: "Fuel Used (liters)" },
    { name: "fuelUnit", type: "text", value: "l", label: "Fuel Unit" }
  ]
};

let solarForms = [];
let transportForms = [];
const dynamicAddBtn = document.createElement("button");
dynamicAddBtn.textContent = "+ Add Another Entry";
dynamicAddBtn.type = "button";

dynamicAddBtn.addEventListener("click", () => {
  const selected = document.getElementById("calcType").value;
  if (selected === "solar") addFormSet("solar");
  if (selected === "transportation") addFormSet("transportation");
});

function addFieldsToForm(fields, container = form) {
  container.innerHTML = "";
  fields.forEach(field => {
    const label = document.createElement("label");
    label.textContent = field.label || field.name;
    if (field.type === "select") {
      const select = document.createElement("select");
      select.name = field.name;
      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });
      container.appendChild(label);
      container.appendChild(select);
    } else {
      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      if (field.value) input.value = field.value;
      container.appendChild(label);
      container.appendChild(input);
    }
  });
}

function addFormSet(type) {
  const container = document.createElement("form");
  container.classList.add(`${type}-set`);
  form.appendChild(container);
  addFieldsToForm(fieldTemplates[type], container);

  if (type === "solar") solarForms.push(container);
  if (type === "transportation") transportForms.push(container);
}


document.getElementById("calcType").addEventListener("change", (e) => {
  const type = e.target.value;
  form.innerHTML = "";
  emissionInfoDiv.innerHTML = "";
  resultDiv.innerHTML = "";
  solarForms = [];
  transportForms = [];

  if (!fieldTemplates[type]) return;

  if (type === "solar" || type == "transportation") {
    addFormSet(type);
    form.parentNode.insertBefore(dynamicAddBtn, form.nextSibling); // Insert after form
  } else {
    addFieldsToForm(fieldTemplates[type], form);
    if (dynamicAddBtn.parentNode) dynamicAddBtn.remove(); // Remove if exists
  }
});

async function submitForm() {
  const type = document.getElementById("calcType").value;
 const countryCode = document.getElementById("countryCode").value;
  if (!type) return alert("Please select a type.");
  let data;

  if (type === "solar") {
    data = solarForms.map(container => {
      const formData = new FormData(container);
      const obj = {};
      for (const [key, val] of formData.entries()) {
        const fieldType = fieldTemplates.solar.find(f => f.name === key)?.type;
        obj[key] = fieldType === "number" ? Number(val) : val;
      }
      return obj;
    });
  } else if (type == "transportation") {
    data = transportForms.map(container => {
      const fd = new FormData(container);
      const obj = {};
      for (const [k, v] of fd.entries()) {
        const fieldType = fieldTemplates.transportation.find(f => f.name === k)?.type;
        obj[k] = fieldType === "number" ? Number(v) : v;
      }
      return obj;
    });
  }


  else {
    data = {};
    new FormData(form).forEach((val, key) => {
      const fieldType = fieldTemplates[type]?.find(f => f.name === key)?.type;
      data[key] = fieldType === "number" ? Number(val) : val;
    });
  }

  const BASE_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:3050"
    : "https://carbon-credit-calculator.onrender.com";

  try {
    const res = await fetch(`${BASE_URL}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data, countryCode })
    });

    const result = await res.json();

    if (res.ok) {
      if (["solar", "transportation"].includes(type) && typeof result.result === "object" && result.result.breakdown) {
        resultDiv.innerHTML = `<strong>Total Credit:</strong> ${result.result.totalCredit} tCO₂<br/><br/><strong>Breakdown:</strong><ul>` +
          result.result.breakdown.map(b => {
            const label = b.buildingType ? `(${b.buildingType})` : b.vehicleType ? `(${b.vehicleType})` : "";
            return `<li>Entry ${b.index + 1} ${label}: ${b.emissionReduction} tCO₂</li>`;
          }).join("") + `</ul>`;
      } else {
        resultDiv.textContent = `Result: ${result.result} tCO₂`;
      }

      emissionInfoDiv.innerHTML = `
            <p><strong>Emission Factor:</strong> ${result.emissionFactor} ${result.unit}</p>
            <p><strong>Source:</strong> ${result.source}</p>
            <p><strong>Emission Category:</strong> ${result.category}</p>
          `;

      if (result.trees_needed_to_offset !== undefined) {
        emissionInfoDiv.innerHTML += `<p><strong> Trees Needed to Offset:</strong> ${result.trees_needed_to_offset}</p>`;
      }


      if (result.offset_cost_to_neutralize !== undefined) {
        emissionInfoDiv.innerHTML += `
    <p><strong>Cost to Offset Emissions:</strong> ${result.offset_cost_to_neutralize} ${result.currency}</p>`;
      }
      // Suggested Offset Projects
      if (Array.isArray(result.suggested_offset_projects)) {
        emissionInfoDiv.innerHTML += `
      <div style="margin-top: 1em;">
        <strong> Suggested Offset Projects:</strong>
        <ul>
          ${result.suggested_offset_projects.map(proj => `
            <li>
              <strong>${proj.name}</strong> (${proj.type}, ${proj.region}):<br/>
              ${proj.description}
            </li>`).join("")}
        </ul>
      </div>
    `;
      }

      resultDiv.className = "result green";
    } else {
      resultDiv.textContent = `Error: ${result.error}`;
      resultDiv.className = "result red";
    }
  } catch (err) {
    resultDiv.textContent = "Network error";
    resultDiv.className = "result red";
  }
}

