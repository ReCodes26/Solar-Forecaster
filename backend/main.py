from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json

# Modules
from weather import get_weather_data
from solar import calculate_solar_data
from aiInsights import generate_insight
from dataFormatter import create_insight_data
from latLonTimezone import get_latitude_longtude_timezone

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    # Location
    zipcode: str
    country: str = "us"

    # Panel Information
    amount_of_panels: int
    panel_area: float
    surface_azimuth: float
    surface_tilt: float


# API Routes

@app.get("/")
def root_message():
    return {"message": "Root API is working"}


@app.get("/forecast")
async def solar_forecaster_generator(user_input: UserInput = Depends()):

    weather_data = None
    solar_data = None
    ai_insight = None
    location_data = None

    # 0. Convert the users location to latitude and longitude and timezone
    try:
        location_data = get_latitude_longtude_timezone(user_input.zipcode,user_input.country)
    except Exception as e:
        print(f"Could not get location data from zipcode: {e}")
        return None  # Return empty if the data was not obtained

    # 1. Get weather data
    try:
        weather_data = get_weather_data(
            latitude=location_data["latitude"],
            longitude=location_data["longitude"],
            timezone=location_data["timezone"],
        )
        print("Weather data fetched successfully")
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None  # Return empty if the data was not obtained

    # 2. Get solar data
    try:
        solar_data = calculate_solar_data(
            latitude=location_data["latitude"],
            longitude=location_data["longitude"],
            timezone=location_data["timezone"],
            hourly_data=weather_data.hourly_data,
            surface_azimuth=user_input.surface_azimuth,
            surface_tilt=user_input.surface_tilt,
            panel_area=user_input.panel_area,
            amount_of_panels=user_input.panel_area,
        )
        print("Solar data calculated successfully")
    except Exception as e:
        print(f"Error fetching solar data: {e}")
        return None  # Return empty if the data was not obtained
    
    # Format data nicely for user display + AI usage
    data_formated = create_insight_data(
        location_data["timezone"],
        weather_data.times,
        weather_data.weather_codes,
        weather_data.hourly_temperatures,
        weather_data.cloud_coverages,
        solar_data.hourly_kwh,
        solar_data.total_kwh,
        weather_data.is_day
    )

    # 3. Generate insights using AI
    try:
        ai_insight = generate_insight(json.dumps(data_formated, indent = 2))
        print("AI data fetched successfully")
    except Exception as e:
        print(f"Error generating AI response: {e}")
        # Continue if AI did not generate

    # Create data for frontend display
    data = None
    if ai_insight:
        data = data_formated | {"AI":ai_insight}
    else:
        data = data_formated
    
    # Add location data
    data.update({"city": location_data["city"], "state": location_data["state_code"]})
    return data


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
