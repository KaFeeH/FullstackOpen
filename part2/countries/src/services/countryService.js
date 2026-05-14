import axios from "axios";
const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;

const getAll = () => {
  const request = axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/all",
  );
  const response = request.then((response) => response.data);
  return response;
};

const getWeather = (country) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric&appid=${api_key}`,
  );
  const response = request.then((response) => response.data);

  return response;
};

export default { getAll, getWeather };
