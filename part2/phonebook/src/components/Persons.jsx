const Persons = ({ listToShow }) => {
  return (
    <>
      {listToShow.map((person) => (
        <p>
          {person.name} {person.number}
        </p>
      ))}
    </>
  );
};

export default Persons;
