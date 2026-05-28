# Weather Module
# This module is responsible for fetching weather data from an external API and processing it
# The data it processes: Hourly weather data, Temperature, POA Irradiance, Weather Code

import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd
from datetime import date
from pydantic import BaseModel, ConfigDict

# Global Variables
cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

url = "https://api.open-meteo.com/v1/forecast"


class WeatherData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    times: pd.DatetimeIndex
    hourly_temperatures: list[float]
    ghis: list[float]
    dnis: list[float]
    dhis: list[float]
    wind_speeds: list[float]
    cloud_coverages: list[float]
    weather_codes: list[float]
    hourly_data: dict[str, any]
    is_day: list[int]


def get_weather_data(latitude, longitude, timezone) -> WeatherData:
    # Set params based on user input
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": [
            "temperature_2m",
            "shortwave_radiation",
            "direct_normal_irradiance",
            "diffuse_radiation",
            "wind_speed_10m",
            "cloud_cover",
            "weather_code",
            "is_day"
        ],
        "forecast_days": 1,
        "timezone": "auto"
    }
    # Fetch weather data from OpenMeteo
    responses = openmeteo.weather_api(url, params=params)

    # Validate data
    if responses == None or len(responses) < 1:
        raise Exception("No weather data retrieved")

    # Get the response by the hour
    response = responses[0]
    hourly = response.Hourly()
    # Get raw time index (utc)
    time_index_utc = pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
        end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=hourly.Interval()),
        inclusive="left",
    )

    # Format hourly data into a clean dictionary
    hourly_data = {
        "time": time_index_utc,
        "localized_time": time_index_utc.tz_convert(timezone),
        "hourly_temperature": hourly.Variables(0).ValuesAsNumpy().tolist(),
        "ghi": hourly.Variables(1).ValuesAsNumpy().tolist(),
        "dni": hourly.Variables(2).ValuesAsNumpy().tolist(),
        "dhi": hourly.Variables(3).ValuesAsNumpy().tolist(),
        "wind_speed": hourly.Variables(4).ValuesAsNumpy().tolist(),
        "cloud_cover": hourly.Variables(5).ValuesAsNumpy().tolist(),
        "weather_codes": hourly.Variables(6).ValuesAsNumpy().tolist(),
        "is_day": hourly.Variables(7).ValuesAsNumpy().tolist(),
    }

    data = WeatherData(
        times=time_index_utc,
        hourly_temperatures=hourly_data["hourly_temperature"],
        ghis=hourly_data["ghi"],
        dnis=hourly_data["dni"],
        dhis=hourly_data["dhi"],
        wind_speeds=hourly_data["wind_speed"],
        cloud_coverages=hourly_data["cloud_cover"],
        weather_codes=hourly_data["weather_codes"],
        hourly_data=hourly_data,
        is_day=hourly_data['is_day']
    )

    return data