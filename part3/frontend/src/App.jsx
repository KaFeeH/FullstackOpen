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

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
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
          .catch((error) => {
            if (error.response.status === 404) {
              setMessage({
                type: "error",
                text: `Information of ${findPerson.name} has already been removed from server`,
              });
            } else {
              setMessage({
                type: "error",
                text: `Error updating person: ${error.response.data.error}`,
              });
            }
            setTimeout(() => {
              clearMessage();
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
          clearMessage();
        }, 5000);
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: `Error adding person: ${error.response.data.error}`,
        });
        setTimeout(() => {
          clearMessage();
        }, 5000);
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
          if (error.response.status === 404) {
            setPersons(persons.filter((p) => p.id !== id));
            setMessage({
              type: "error",
              text: `Information of ${person.name} has already been removed from server`,
            });
          } else {
            setMessage({
              type: "error",
              text: `Error deleting person: ${error.response.data.error}`,
            });
          }
          setTimeout(() => {
            clearMessage();
          }, 5000);
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
