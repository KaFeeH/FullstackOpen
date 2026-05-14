const SearchInput = ({ onChange }) => {
  return (
    <input
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};

export default SearchInput;
