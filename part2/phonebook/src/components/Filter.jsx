const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      filter shown with
      <input onChange={(e) => handleFilterChange(e.target.value)} />
    </div>
  );
};

export default Filter;
