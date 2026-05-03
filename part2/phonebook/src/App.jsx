import { useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [filter, setFilter] = useState("");

  const listToShow =
    filter === ""
      ? persons
      : persons.filter((person) => person.name.includes(filter));

  const handlePersonSubmit = (event, newName, newNumber) => {
    event.preventDefault();
    if (persons.find((person) => person.name === newName))
      return alert(`${newName} is already added to phonebook`);

    if (newName && newNumber)
      setPersons(persons.concat({ name: newName, number: newNumber }));
  };

  const handleFilterChange = (filter) => setFilter(filter);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm handlePersonSubmit={handlePersonSubmit} />
      <h2>Numbers</h2>
      <Persons listToShow={listToShow} />
    </div>
  );
};

export default App;
