import axios from "axios";

const submitSolarData = async (solarData) => {
  // Send the data to the backend API
  try {
    const response = await axios.get("http://localhost:8000/forecast", {
      params: {
        zipcode: solarData.zipcode,
        amount_of_panels: solarData.panels,
        panel_area: solarData.area,
        surface_azimuth: solarData.azimuth,
        surface_tilt: solarData.tilt,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error.response.data);
  }
};

export default submitSolarData;
