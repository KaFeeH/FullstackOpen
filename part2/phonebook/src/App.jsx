import { useState, useEffect } from "react";
import personService from "./services/personService.js";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  let listToShow = filter
    ? persons.filter((person) => person.name.includes(filter))
    : persons;

  const clearForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();

    const findPerson = persons.find((person) => person.name === newName);

    if (findPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        personService
          .changePerson(findPerson.id, { ...findPerson, number: newNumber })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === findPerson.id ? response.data : person,
              ),
            );
            clearForm();
          })
          .catch(() => {
            setMessage({
              type: "error",
              text: `Information of ${findPerson.name} has already been removed from server`,
            });
            setTimeout(() => {
              setMessage({ type: "", text: "" });
            }, 5000);
          });
      }
      return;
    }

    personService
      .addPerson({ name: newName, number: newNumber })
      .then((response) => {
        setPersons(persons.concat(response.data));
        setMessage({
          type: "success",
          text: `Added ${response.data.name}`,
        });
        clearForm();
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);
      })
      .catch((error) => {
        alert("Failed to add person:", error.message);
      });
  };

  const handleDeletePerson = (id, person) => {
    if (window.confirm(`Delete ${person.name}?`))
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          alert("Failed to delete person:", error.message);
        });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {message.text && <h2 className={`${message.type}`}>{message.text}</h2>}
      <Filter onChange={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        onSubmit={handlePersonSubmit}
      />
      <h2>Numbers</h2>
      <Persons listToShow={listToShow} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
