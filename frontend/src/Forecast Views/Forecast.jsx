import { Card, ScrollShadow } from "@heroui/react";
import WeatherToIcon from "../weather_code_icons";
import MiniForecastCard from "./MiniForecastCard";
import ElectricityTrend from "./ElectricityTrend";
import brain from "../assets/brain-ai.svg";

export default function Forecast(RawForecastData) {
  // Get the first index
  let ForecastData = RawForecastData.solarData;

  // Functions
  function getTodayDateString() {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date().toLocaleDateString("en-GB", options);
  }
  function formatIndexToTime(index) {
    if (index < 0 || index > 23) return "Invalid index";
    const period = index < 12 ? "AM" : "PM";
    let hour = index % 12;
    if (hour === 0) hour = 12;
    return `${hour}:00 ${period}`;
  }
  function getCurrentHourIndex() {
    return new Date().getHours();
  }
  function getHighLow() {
    let high = Math.max(
      ...ForecastData.data.map((item) => item.fahrenheit_temperature),
    );
    let low = Math.min(
      ...ForecastData.data.map((item) => item.fahrenheit_temperature),
    );

    return { high: high, low: low };
  }

  let currentHourData = ForecastData.data[getCurrentHourIndex()];
  let hightLow = getHighLow();
  let electricity = ForecastData.data.map((hour) => hour.kwh_generated);
  let bestSolarKwh = Math.max(
    ...ForecastData.data.map((item) => item.kwh_generated),
  );
  let bestSolarHour = formatIndexToTime(
    ForecastData.data.findIndex((item) => item.kwh_generated === bestSolarKwh),
  );
  let AIData = ForecastData?.AI;

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="md:col-span-3 col-span-5  h-52 p-6">
          <Card.Header>
            <Card.Title className="text-xl font-bold">{`${ForecastData.city}, ${ForecastData.state}`}</Card.Title>
            <Card.Description className="text-xs">
              {getTodayDateString()}
            </Card.Description>
          </Card.Header>
          <Card.Content className="">
            <div className="w-full flex justify-between ">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={WeatherToIcon(
                    currentHourData.weather_description,
                    currentHourData.is_day,
                  )}
                  alt={currentHourData.weather_description}
                  width="85"
                  height="85"
                  className="drop-shadow"
                />
                <p className="text-base font-normal">
                  {currentHourData.weather_description}
                </p>
              </div>
              <div className="flex flex-col items-end justify-center text-left gap-2">
                <p className="text-5xl font-bold text-yellow-500">{`${currentHourData.fahrenheit_temperature}°F`}</p>
                <p className="text-xs font-light">{`High: ${hightLow.high}° Low: ${hightLow.low}°`}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card className="h-52 gap-2 col-span-5 md:col-span-2 p-6">
          <Card.Header className=" gap-2">
            <Card.Title className="text-xl font-bold ">
              Today's Solar Production
            </Card.Title>
          </Card.Header>
          <Card.Content className="justify-center">
            <span className="flex items-center ">
              <p className="text-5xl text-blue-600 font-bold flex items-baseline">
                {ForecastData.total_kwh}{" "}
                <span className="text-sm font-light">kWh</span>
              </p>
              <svg
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                width="70"
                height="70"
                className="stroke-blue-600"
              >
                <g id="SVGRepo_bgCarrier"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier" stroke-width="1.3">
                  <path
                    d="m6.5 7.5h4l-6 9v-6.997l-4-.003 6-9z"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    transform="translate(5 2)"
                  ></path>
                </g>
              </svg>
            </span>
          </Card.Content>
        </Card>
        <Card className="col-span-5 md:col-span-full  p-6">
          <Card.Header>
            <Card.Title className="text-xl font-bold">Hourly Data</Card.Title>
          </Card.Header>
          <Card.Content>
            <ScrollShadow className="h-66" orientation="horizontal">
              <div className="h-full flex flex-row gap-4 overflow-x-scroll px-2 pt-2 pb-6">
                {ForecastData.data.map((data, index) => {
                  return (
                    <MiniForecastCard
                      key={data.local_time}
                      temperature={data.fahrenheit_temperature}
                      energy={data.kwh_generated}
                      weatherDescription={data.weather_description}
                      isDay={data.is_day}
                      hour={formatIndexToTime(index)}
                    />
                  );
                })}
              </div>
            </ScrollShadow>
          </Card.Content>
        </Card>
        <Card className="h-58 col-span-5 md:col-span-full  p-6">
          <Card.Header>
            <Card.Title className="text-xl font-bold">
              Electricity Trend
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <ElectricityTrend ElectricityData={electricity} />
          </Card.Content>
        </Card>
        <Card className="h-68 md:col-span-2 col-span-5 p-6">
          <Card.Header>
            <Card.Title className="text-xl font-bold">
              Best Solar Hour
            </Card.Title>
          </Card.Header>
          <Card.Content className="justify-center">
            <div className="flex flex-row items-baseline gap-4">
              <p className="font-bold text-5xl text-yellow-500">
                {bestSolarHour.replace(/:00|\s/g, "")}
              </p>
              <p className="font-semibold text-lg">{`${bestSolarKwh}kW`}</p>
            </div>
          </Card.Content>
          <Card.Footer>
            <p className="text-sm">
              Solar production peaks at {bestSolarHour} today. This is the best
              time to run heavy appliances.
            </p>
          </Card.Footer>
        </Card>
        <Card className="md:col-span-3 col-span-5 h-68  p-6">
          <Card.Header>
            <span className="flex flex-row items-center gap-2">
              <Card.Title className="text-xl font-bold">AI Insights</Card.Title>
              <img
                src={brain}
                alt="Clear day"
                width="24"
                height="24"
                className="drop-shadow"
              />
            </span>
          </Card.Header>
          <Card.Content className="h-full   justify-center">
            {AIData ? (
              <ScrollShadow className="flex flex-col max-h-60 pb-6 gap-4">
                <p>
                  <span className="text-xl">⛅</span> {AIData["Task 1"]}
                </p>
                <p>
                  <span className="text-xl">⚡</span> {AIData["Task 2"]}
                </p>
                <span className="flex flex-col">
                  <p>
                    <span className="text-xl">💡</span> You could power:
                  </p>
                  <ul class="list-disc pl-12 text-sm pt-1">
                    {AIData["Task 3"].map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </span>
              </ScrollShadow>
            ) : (
              <p className="text-red-500">
                No AI data is available. Please try again later
              </p>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
