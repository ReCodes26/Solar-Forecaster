import { Card } from "@heroui/react";
import WeatherToIcon from "../weather_code_icons";

export default function MiniForecastCard({hour, temperature, energy, weatherDescription, isDay}) {
  return (
    <Card className="items-center justify-center flex flex-col gap-2 h-full min-w-30 text-center shadow-md border border-gray-200">
      <p>{hour}</p>
      <img
        src={WeatherToIcon(weatherDescription, isDay)}
        alt={weatherDescription}
        width="30"
        height="30"
        className="drop-shadow"
      />
      <p className="font-bold text-yellow-500 text-base">{`${temperature}°`}</p>
      <p className="font-bold text-blue-500 text-base">{`${energy} kW`}</p>
      <p>{weatherDescription}</p>
    </Card>
  );
}
