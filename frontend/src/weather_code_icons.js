import clearDay from "@meteocons/svg/fill/clear-day.svg";
import clearNight from "@meteocons/svg/fill/clear-night.svg";
import mostlyClearDay from "@meteocons/svg/fill/mostly-clear-day.svg";
import mostlyClearNight from "@meteocons/svg/fill/mostly-clear-night.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import partlyCloudyNight from "@meteocons/svg/fill/partly-cloudy-night.svg";
import cloudy from "@meteocons/svg/fill/cloudy.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import heavyRain from "@meteocons/svg/fill/extreme-rain.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import heavySnow from "@meteocons/svg/fill/extreme-snow.svg";
import thunderstorm from "@meteocons/svg/fill/thunderstorms.svg";
import hail from "@meteocons/svg/fill/hail.svg";
import heavyHail from "@meteocons/svg/fill/extreme-hail.svg";

export default function WeatherToIcon(weatherDesc, isDay) {
  switch (weatherDesc) {
    case "Clear":
      return isDay ? clearDay : clearNight;
    case "Mostly Clear":
      return isDay ? mostlyClearDay : mostlyClearNight;
    case "Partly Cloudy":
      return isDay ? partlyCloudyDay : partlyCloudyNight;
    case "Cloudy":
      return cloudy;
    case "Fog":
      return fog;
    case "Freezing Fog":
      return fog;
    case "Light Drizzle":
      return drizzle;
    case "Drizzle":
      return drizzle;
    case "Heavy Drizzle":
      return drizzle;
    case "Light Freezing Drizzle":
      return drizzle;
    case "Freezing Drizzle":
      return drizzle;
    case "Light Rain":
      return rain;
    case "Rain":
      return rain;
    case "Heavy Rain":
      return heavyRain;
    case "Light Freezing Rain":
      return rain;
    case "Freezing Rain":
      return rain;
    case "Light Snow":
      return snow;
    case "Snow":
      return snow;
    case "Heavy Snow":
      return heavySnow;
    case "Snow Grains":
      return snow;
    case "Light Rain Shower":
      return rain;
    case "Rain Shower":
      return rain;
    case "Heavy Rain Shower":
      return heavyRain;
    case "Snow Shower":
      return snow;
    case "Heavy Snow Shower":
      return heavySnow;
    case "Thunderstorm":
      return thunderstorm;
    case "Hailstorm":
      return hail;
    case "Heavy Hailstorm":
      return heavyHail;
  }
  return clearDay; // Default to clear day icon if one cannot be found
}
