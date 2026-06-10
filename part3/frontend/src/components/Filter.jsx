const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with
      <input onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default Filter;
