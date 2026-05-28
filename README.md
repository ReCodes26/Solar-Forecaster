# ☀️ Solar Forecaster

AI-powered solar energy forecasting web application using real-world weather data, PVlib physics modeling, and hourly solar production simulation.

*Live Demo Coming Soon*

---

## ⚡Overview

This project simulates residential solar energy production using real weather conditions and photovoltaic (PV) modeling.

The application combines:

* Real-time weather forecasting
* PVlib solar physics calculations
* Plane-of-array (POA) irradiance modeling
* Temperature-based efficiency correction
* AI-generated homeowner energy insights

The goal of the project is to demonstrate how weather conditions directly affect residential solar power generation in a realistic and intuitive way.

---

## ⚡Features

* Hourly solar production forecasting
* Real-time weather integration
* PVlib-based irradiance calculations
* Temperature correction modeling
* Daily kWh estimation
* AI-generated energy insights
* Interactive React dashboard
* FastAPI backend API

---

## ⚡Solar Physics Model

The application estimates solar power output using:

P = POA_global × A × ηref × Tc × L

Where:

* POA_global = plane-of-array irradiance
* A = solar panel area
* ηref = panel efficiency under standard test conditions
* Tc = temperature correction factor
* L = system loss factor

Temperature correction:

Tc = 1 + γ(Tpanel − 25)

This allows the application to simulate:

* thermal efficiency loss
* irradiance variation
* cloud cover effects
* real-world environmental conditions

---

## ⚡Technologies Used

### Frontend

* React
* Recharts
* CSS / Tailwind / HeroUI

### Backend

* FastAPI
* Python

### Solar Modeling

* PVlib
* NumPy

### APIs

* Open-Meteo API
* Google AI Studio API

---

## ⚡How It Works

1. Weather data is fetched from the Open-Meteo API based on the user's location
2. PVlib calculates:

   * Solar position
   * Extraterrestrial Direct Normal Irradiance (EDNI)
   * POA irradiance
   * Panel temperature
3. The backend computes hourly watt production
4. Daily energy totals are generated in kWh
5. AI-generated insights summarize energy production conditions

---

## ⚡Example AI Insights

The AI insights help homeowners understand what the calculated energy output can power with analogies. This project uses Google's AI Studio API (Gemini 3.1 Flash Lite).

* "Today is very cloudy with occasional rain showers, which significantly limits solar energy levels throughout the day."
* "The optimal period for solar energy production occurs between 11:00 AM and 12:00 PM."
* "You can run 10 LED light bulbs simultaneously for 15 hours."

---

## ⚡Real-World Applications

This project demonstrates how weather-aware solar forecasting can help:

* Homeowners understand energy production
* Optimize appliance usage
* Estimate daily solar efficiency
* Visualize the impact of cloud cover and heat on solar systems

---

## ⚡Screenshots

(Add screenshots here after deployment)

---

## ⚡Credits

Built by Ariana ([ReCodes26](https://github.com/ReCodes26))

Icons from [Meteocons](https://meteocons.com/)

Weather API from [Open Meteo](https://open-meteo.com/)

