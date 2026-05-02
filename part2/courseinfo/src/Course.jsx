const Course = ({ course }) => {
  const Header = ({ name }) => <h1>{name}</h1>;

  const Total = ({ parts }) => (
    <b>
      total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
    </b>
  );

  return (
    <main>
      <Header name={course.name} />
      {course.parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <Total parts={course.parts} />
    </main>
  );
};

export default Course;
