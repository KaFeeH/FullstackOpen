const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  onSubmit,
}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input required value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number:
        <input required value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
