import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

const API_KEY = 'your_API_key'; 
const cities = ['Москва', 'Санкт-Петербург', 'Нью-Йорк', 'Токио', "Анадырь"]; 

const App = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [view, setView] = useState('current');

  const fetchWeatherData = async (city) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    setWeatherData(response.data);
  };

  const fetchForecastData = async (city) => {
    try {
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (weatherData) {
      fetchForecastData(selectedCity);
    }
  }, [weatherData, selectedCity]);

  const renderWeather = () => {
    if (!weatherData) return <p>Загрузка данных на сегодня ...</p>;
    
    return (
      <div>
        <h2>Погода в {weatherData.name}</h2>
        <p>Температура: {weatherData.main.temp}°C</p>
        <p>Погодные условия: {weatherData.weather[0].description}</p>
      </div>
    );
  };

  const renderForecast = () => {
    if (!forecastData || !forecastData.list || !Array.isArray(forecastData.list)) {
      return <p>Загрузка данных на пять дней...</p>;
    }

    return (
      <div>
        <h2>Прогноз на ближайшие 5 дней</h2>
        <ul>
          {forecastData.list.slice(0, 5).map((day, index) => (
            <li key={index}>
              <p>Дата: {new Date(day.dt * 1000).toLocaleDateString()}</p>
              <p>Температура: {day.main.temp}°C</p>
              <p>Погодные условия: {day.weather && day.weather.length > 0 ? day.weather[0].description : 'Нет данных'}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Сервис прогноза хорошей погоды</h1>
      <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <button onClick={() => setView('current')}>По состоянию на сейчас</button>
      <button onClick={() => setView('forecast')}>На пять дней</button>
      
      {view === 'current' && renderWeather()}
      {view === 'forecast' && renderForecast()}
    </div>
  );
}

export default App;
