# Format the raw data obtained from the weather and solar APIs into json objects

from retry_requests import retry
import pandas as pd
from pprint import pprint


def create_insight_data(timezone: str, times_utc: list[pd.DatetimeIndex], weather_codes: list[int], temperatures: list[float], cloud_coverages:list[float], kwhs: list[float], total_kwh: float, is_days:list[int]):

    insight_data: dict[str, list] = {
        "data":[],
        "total_kwh": round(total_kwh, 2)

    }

    for i in range(len(times_utc)):      
        # Covert time_utc to local time of user
        local_time = times_utc[i].tz_convert(timezone).strftime('%B %d, %Y %I:%M %p')
        weather_description: str = weather_code_to_description(weather_codes[i])
        # Convert C to F
        celcius_temperature: float = temperatures[i]
        fahrenheit_temperature: float = round((celcius_temperature * 9/5) + 32)
        cloud_coverage: int = cloud_coverages[i]
        kwh_generated: float = kwhs[i]
        is_day: int = is_days[i]


        
        # Create data structure
        data = {
            "local_time": local_time,
            "weather_description": weather_description,
            "fahrenheit_temperature": fahrenheit_temperature,
            "cloud_coverage": cloud_coverage,
            "kwh_generated": kwh_generated,
            "is_day": is_day
        }

        insight_data["data"].append(data)


    return insight_data

def weather_code_to_description(code):
    weather_codes = {
        0: "Clear",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Freezing Fog",
        51: "Light Drizzle",
        53: "Drizzle",
        55: "Heavy Drizzle",
        56: "Light Freezing Drizzle",
        57: "Freezing Drizzle",
        61: "Light Rain",
        63: "Rain",
        65: "Heavy Rain",
        66: "Light Freezing Rain",
        67: "Freezing Rain",
        71: "Light Snow",
        73: "Snow",
        75: "Heavy Snow",
        77: "Snow Grains",
        80: "Light Rain Shower",
        81: "Rain Shower",
        82: "Heavy Rain Shower",
        85: "Snow Shower",
        86: "Heavy Snow Shower",
        95: "Thunderstorm",
        96: "Hailstorm",
        99: "Heavy Hailstorm",
    }
    return weather_codes.get(code, "Unknown")