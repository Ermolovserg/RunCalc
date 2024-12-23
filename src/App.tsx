import { useState } from 'react';
import './App.css';

type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

type Result = {
  adjusted: { minutes: number; seconds: number };
  lap: { minutes: number; seconds: number } | null;
} | null;

const App = () => {
  const [time, setTime] = useState<Time>({ hours: '', minutes: '', seconds: '' });
  const [percentage, setPercentage] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [lap, setLap] = useState<number | null>(null);
  const [result, setResult] = useState<Result>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePace = () => {
    const totalSeconds =
      parseInt(time.hours || '0') * 3600 +
      parseInt(time.minutes || '0') * 60 +
      parseInt(time.seconds || '0');
    const adjustedSeconds = totalSeconds / (parseFloat(percentage) / 100);

    const adjustedMinutes = Math.floor(adjustedSeconds / 60);
    const adjustedRemainderSeconds = Math.round(adjustedSeconds % 60);

    let lapResult = null;
    if (lap) {
      const laps = parseFloat(distance) / lap;
      const lapPaceSeconds = adjustedSeconds / laps;
      const lapMinutes = Math.floor(lapPaceSeconds / 60);
      const lapSeconds = Math.round(lapPaceSeconds % 60);
      lapResult = { minutes: lapMinutes, seconds: lapSeconds };
    }

    setResult({
      adjusted: { minutes: adjustedMinutes, seconds: adjustedRemainderSeconds },
      lap: lapResult,
    });
  };

  return (
    <div className="app">
      <h1>Калькулятор темпа бега</h1>

      <div className="input-group">
        <label>
          Дистанция (м):
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Введите дистанцию"
            min="1"
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Часы:
          <input
            type="number"
            name="hours"
            value={time.hours}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
        </label>
        <label>
          Минуты:
          <input
            type="number"
            name="minutes"
            value={time.minutes}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
        </label>
        <label>
          Секунды:
          <input
            type="number"
            name="seconds"
            value={time.seconds}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Процент от темпа:
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="Введите %"
            min="1"
            max="100"
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Выбор длины круга (м):
          <select value={lap || ''} onChange={(e) => setLap(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">Без круга</option>
            <option value="200">200 м</option>
            <option value="400">400 м</option>
          </select>
        </label>
      </div>

      <button onClick={calculatePace}>Рассчитать</button>

      {result && (
        <div className="result">
          <p>
            Общее время с учетом процента: {result.adjusted.minutes} минут {result.adjusted.seconds} секунд
          </p>
          {result.lap && (
            <p>
              Темп на круг: {result.lap.minutes} минут {result.lap.seconds} секунд
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
