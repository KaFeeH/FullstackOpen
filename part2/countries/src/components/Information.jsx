const Information = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {country.weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/payload/api/media/file/${country.weather.weather[0].icon}.png`}
      />
      <p>Wind {country.weather.wind.speed} m/s</p>
    </>
  );
};

export default Information;
