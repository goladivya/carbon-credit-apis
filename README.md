# 🌱 Carbon Credit Calculator

A web-based tool to calculate carbon credits for different energy sectors such as Solar, Thermal, Hydro, Transmission, and Transportation. Built using **TypeScript**, **Node.js (Express)**, and a responsive frontend with **HTML/CSS/JavaScript**

##  Live Demo
https://carbon-credit-calculator.onrender.com

## 🛠 Features

- 🌞 **Solar** emission calculations based on energy generated and building type.
- 🔥 **Thermal** emissions based on fuel type and amount.
- 💧 **Hydro** calculations based on reservoir area and duration.
- ⚡ **Transmission** loss calculations using total generated and delivered energy.
- 🚗 **Transportation** emissions from fuel usage.
- 🌐 Frontend hosted on Render with backend API integration.
- 🔄 Real-time results and interactive form inputs

## 📁 Folder Structure

carbon-credit-calculator/
├── public/ # Frontend (index.html, CSS, JS)
├── src/ # Source TypeScript files
│ ├── server/ # Express server
│ ├── constants/ # Sector-specific constants
│ └── calculators/ # Calculation logic for each sector
├── dist/ # Compiled JS (generated after build)
├── package.json
├── tsconfig.json
└── README.md


##  Tech Stack

- **Backend**: Node.js, Express
- **Language**: TypeScript
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Deployment**: [Render](https://render.com)



A web-based tool to calculate carbon credits, adapted and extended from [xeptagondev/carbon-registry](https://github.com/xeptagondev/carbon-registry).
