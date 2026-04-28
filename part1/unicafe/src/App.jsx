import { useState } from "react";

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
  );

  const StatisticsLine = ({ text, value }) => (
    <tr>
      <td>{text}</td> <td>{value}</td>
    </tr>
  );

  const Statistics = () => {
    const all = good + neutral + bad;
    return all ? (
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={(good - bad) / all} />
          <StatisticsLine text="positive" value={`${(good / all) * 100} %`} />
        </tbody>
      </table>
    ) : (
      <p>No feedback given</p>
    );
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics />
    </div>
  );
};

export default App;
