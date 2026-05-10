const Persons = ({ listToShow, onDelete }) => {
  return (
    <>
      {listToShow.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person)}>delete</button>
        </div>
      ))}
    </>
  );
};

export default Persons;
