const ListCountries = ({ countries, onClick }) => {
  {
    if (countries.length > 10)
      return <p>Too many matches, specify another filter</p>;
  }

  return (
    <ul>
      {countries.map((c) => (
        <li key={c.name.common}>
          {c.name.common}{" "}
          <button onClick={() => onClick(c.name.common)}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default ListCountries;
