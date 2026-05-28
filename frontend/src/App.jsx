import { Button, useOverlayState } from "@heroui/react";
import SunnyIcon from "./assets/sunny-icon.svg";
import { Input, Label, TextField } from "@heroui/react";
import DataPending from "./Forecast Views/DataPending";
import LoadingSkeleton from "./Forecast Views/LoadingSkeleton";
import Forecast from "./Forecast Views/Forecast";
import Popup from "./Forecast Views/Popup";
import { useState } from "react";
import axios from "axios";
import submitSolarData from "./api";

export default function App() {
  const state = useOverlayState();
  const [backendData, setBackendData] = useState();
  const [zipCode, setZipCode] = useState();
  const [previousZipCode, setPreviousZipCode] = useState();
  const [isRequestError, setIsRequestError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isZipInvalid = !/^\d{5}$/.test(zipCode);

  let ForecastComponent;

  if (isLoading) {
    ForecastComponent = LoadingSkeleton;
  } else if (isRequestError) {
    ForecastComponent = () => (
      <DataPending
        isError={true}
        errorMessage="Error occurred while fetching data."
      />
    );
  } else if (backendData && !isRequestError) {
    // Send the data to the forecast view
    ForecastComponent = () => <Forecast solarData={backendData} />;
  } else {
    ForecastComponent = () => <DataPending isError={false} />;
  }

  const handleDataSubmit = async (solarData) => {
    // Check if the zip code is valid
    if (!isZipInvalid && zipCode !== previousZipCode) {
      // Set previous zip code
      setPreviousZipCode(zipCode);
      setIsRequestError(false); // Clear Errors

      setIsLoading(true); // Start loading
      console.log("Valid data received from popup:", solarData);
      solarData["zipcode"] = zipCode; // Add the zip code to the data

      try {
        const data = await submitSolarData(solarData); // Await the response

        // Check if the data is null or empty
        if (data === null || data === "" || data === "null")
          throw "Data received from backend is null";

        setBackendData(data); // Save the data to a variable
      } catch (error) {
        setIsRequestError(true); // Set error flag
        console.log(error);
      } finally {
        setIsLoading(false); // Enable the button again
      }
    } else {
      alert("Invalid Zip Code. Please enter a new one");
    }
  };

  const handleSearch = () => {
    if (!isZipInvalid) {
      state.open();
    } else {
      alert("Invalid Zip Code");
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col gap-8 lg:gap-6 items-center  bg-background text-foreground"
      data-theme="light"
    >
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Solar Forecaster</title>

      <Popup
        isOpen={state.isOpen}
        onClose={() => state.setOpen(false)}
        onSaveSuccess={handleDataSubmit}
      />

      <div className="pt-12 px-[8%] lg:px-[24%] w-full grow">
        <div
          id="input-container"
          className="flex flex-col gap-4 lg:gap-2 items-center w-full "
        >
          <h1 className="flex items-center gap-2">
            <img src={SunnyIcon} alt="Sunny Icon" className="w-12 h-12" /> Solar
            Forecaster
          </h1>
          <p className="text-center">
            Enter a zip code to get the hourly solar forecast for today
          </p>

          <div className="flex gap-2 h-9 w-full mt-4 px-[3%] lg:px-[18%]">
            <TextField className="w-full h-full">
              <Input
                fullWidth={true}
                className=" h-full"
                name="zipcode"
                type="number"
                min={0}
                max={99999}
                onChange={(e) => setZipCode(e.target.value)}
                value={zipCode}
                isInvalid={isZipInvalid}
                placeholder="Enter zip code"
                disabled={isLoading}
              />
              {isZipInvalid ?? (
                <FieldError>Please enter a valid zip code.</FieldError>
              )}
            </TextField>
            <Button
              isDisabled={isLoading}
              className="h-full"
              onPress={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        <div
          id="forecast-container"
          className="flex flex-col w-full items-center pt-5 "
        >
          <ForecastComponent />
        </div>
      </div>

      <footer className="flex flex-col items-center justify-center w-full">
        <hr class="border-t border-gray-300 w-full h-1" />
        <div className="py-4 gap-1 flex flex-col items-center justify-center text-center">
          <a href="https://github.com/ReCodes26" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="grey"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <p className="text-sm">
            Weather API from{" "}
            <a
              className="text-blue-500"
              href="https://open-meteo.com/ "
              target="_blank"
            >
              OpenMeteo
            </a>
          </p>
          <p className="text-sm">
            Weather Icons from{" "}
            <a
              className="text-blue-500"
              href="https://meteocons.com/"
              target="_blank"
            >
              Meteocons
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
