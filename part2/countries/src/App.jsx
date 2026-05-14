import { useState, useEffect } from "react";
import countryService from "./services/countryService.js";
import SearchInput from "./components/SearchInput.jsx";
import Information from "./components/Information.jsx";
import ListCountries from "./components/ListCountries.jsx";

function App() {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    let request;
    let filteredCountries = [];
    if (country) {
      request = setTimeout(() => {
        countryService
          .getAll()
          .then((response) => {
            filteredCountries = response.filter((c) =>
              c.name.common.toLowerCase().includes(country.toLowerCase()),
            );
            if (filteredCountries.length === 1) {
              countryService
                .getWeather(filteredCountries[0])
                .then((response) => {
                  setCountries([
                    { ...filteredCountries[0], weather: response },
                  ]);
                });
            } else setCountries(filteredCountries);
          })
          .catch((error) => {
            console.error("Error fetching countries:", error);
          });
      }, 1000);
    }
    return () => {
      clearTimeout(request);
    };
  }, [country]);

  const renderContent = () => {
    if (countries.length === 0) return null;
    if (countries.length === 1) {
      return <Information country={countries[0]} />;
    }
    return <ListCountries countries={countries} onClick={setCountry} />;
  };

  return (
    <>
      <div>
        find countries <SearchInput onChange={setCountry} />
      </div>
      {renderContent()}
    </>
  );
}

export default App;
