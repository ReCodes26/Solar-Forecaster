# Solar Module
# Gives the hourly solar data
# Irradiance in W/m^2, kWh generatedKWH per hour, Total KWH for today, best/highest solar hour.

import pvlib
from pydantic import BaseModel
import numpy as np


# Classes
class SolarData(BaseModel):
    hourly_kwh: list[float]
    total_kwh: float
    best_hour: int


# Functions
def calculate_solar_position(lat, lon, tzn, temperature, time_index):
    # Get location
    location = pvlib.location.Location(lat, lon, tzn)

    solar_positions = location.get_solarposition(times=time_index, temperature=temperature)

    return solar_positions


def calculate_POA_irradiance(
    lat,
    lon,
    tzn,
    temp,
    hourly_times,
    ghi,
    dni,
    dhi,
    surface_tilt,
    surface_azimuth,
    local_times,
):
    # Calculate the position of the sun in the sky
    solar_position = calculate_solar_position(
        time_index=hourly_times, lat=lat, lon=lon, tzn=tzn, temperature=temp
    )

    # Calculate Extraterrestrial Direct Normal Irradiance (EDNI). This is the raw power of the sun BEFORE it hits the earth's atmosphere
    edni = pvlib.irradiance.get_extra_radiation(hourly_times)

    # Calculate Plane of Array (POA)
    POA = pvlib.irradiance.get_total_irradiance(
        surface_tilt=surface_tilt,
        surface_azimuth=surface_azimuth,
        solar_zenith=solar_position["apparent_zenith"],
        solar_azimuth=solar_position["azimuth"],
        dni=dni,
        ghi=ghi,
        dhi=dhi,
        dni_extra=edni,
        model="perez",
    )

    # clear all NaN values
    POA = POA.fillna(0)

    POA.insert(0, "Local Time", local_times)
    POA = POA.assign(ghi=ghi, dhi=dhi, dni=dni)

    return POA


def calculate_temperature_correction(POA_global, air_temp, wind_speed):
    # Calculate the temperature of the cells based on the SAPM Model
    residential_params = pvlib.temperature.TEMPERATURE_MODEL_PARAMETERS["sapm"][
        "close_mount_glass_glass"
    ]
    t_panel = pvlib.temperature.sapm_cell(
        poa_global=POA_global,
        temp_air=air_temp,
        wind_speed=wind_speed,
        a=residential_params["a"],
        b=residential_params["b"],
        deltaT=residential_params["deltaT"],
    )

    # Set gamma. Here are some standard panel types and their gamma vaue:

    # Standard / Monocrystalline: -0.0035 — Most common for modern home solar
    # Premium / High-Efficiency: -0.0030 — For high-end panels like Maxeon or Panasonic.
    # Thin-Film: -0.0020 — Less common, but highly heat-resistant
    gamma = -0.0035

    # Calculate temperature correction
    tc = 1 + gamma * (t_panel - 25)

    return tc


def calculate_watts(
    POA_global, panel_area, panel_efficiency, temperature_correction, loss_factor
):
    watts = (
        POA_global
        * panel_area
        * panel_efficiency
        * temperature_correction
        * loss_factor
    )
    return watts


def convert_to_Kwh(watts, hours=1):
    return (watts * hours) / 1000


def calculate_solar_data(latitude, longitude, timezone, hourly_data, surface_tilt, surface_azimuth, panel_area, amount_of_panels):

    # Calculate the POA irradiance
    POA = calculate_POA_irradiance(
        lat=latitude,
        lon=longitude,
        tzn=timezone,
        temp=np.array(hourly_data["hourly_temperature"]),
        hourly_times=hourly_data["time"],
        ghi=np.array(hourly_data["ghi"]),
        dni=np.array(hourly_data["dni"]),
        dhi=np.array(hourly_data["dhi"]),
        surface_tilt=surface_tilt,
        surface_azimuth=surface_azimuth,
        local_times=hourly_data["localized_time"],
    )

    # List the watts per hour
    list_length = len(POA["poa_global"])

    kwh_total = 0

    kwh_list = []

    for i in range(list_length):
        poa_global = POA["poa_global"].iloc[i]
        current_air_temp = hourly_data["hourly_temperature"][i]
        current_wind_speed = hourly_data["wind_speed"][i]
        tc = calculate_temperature_correction(
            poa_global, air_temp=current_air_temp, wind_speed=current_wind_speed
        )
        watts = calculate_watts(
            POA_global=poa_global,
            panel_area=panel_area,
            panel_efficiency=0.20,
            temperature_correction=tc,
            loss_factor=0.9,
        )

        # IMPORTANT: Multiply by amount of panels to determine how much energy ALL panels will produce
        watts *= amount_of_panels

        kwh = convert_to_Kwh(watts)  # Convert to kWh
        kwh = round(kwh, 3)  # Round for readability

        # Add to the hourly kwh list
        kwh_list.append(kwh)

        # Add to running total
        kwh_total += kwh

    # Calculate the best/highest solar hour index
    best_hour_index = kwh_list.index(max(kwh_list, default=0))

    data = SolarData(
        hourly_kwh=kwh_list, total_kwh=kwh_total, best_hour=best_hour_index
    )

    return data
