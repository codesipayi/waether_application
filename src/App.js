import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
console.log(process.env);
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?`;
const App = () => {
  const [city, setCity] = useState('sirsi');
  const [error, setError] = useState(null);
  const [temparature, setTemparature] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }

  const success = (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    updateCurrentLocationTemp(lat, lon);
  }

  const hitApi = async (url) => {
    let response = null;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        response = data;
      })
      .catch(err => {
        console.log(err);
      })

    return response;
  }

  const updateCurrentLocationTemp = async (lat, lon) => {
    let url = BASE_URL + `lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    let data = await hitApi(url);
    if (data.cod === 200) {
      setError(null);
      setTemparature(data.main.temp);
    }
    else
      setError(data.message);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    let url = BASE_URL + `q=${city}&units=metric&appid=${API_KEY}`;
    let data = await hitApi(url);
    if (data.cod === 200)
      setTemparature(data.main.temp);
    else
      setError(data.message);
  }
  return (
    <div>
      <h1 className="weather">Weather</h1>
      <div className="container">
        <form onSubmit={handleSearch}>
          <input className="inputbox" onChange={(e) => setCity(e.target.value)} type="text" id="inputCity" name="inputCity"></input>
          <button className="searchbutton" type="submit" onClick={handleSearch}>Search!</button>
        </form>
      </div>
      {temparature && !error &&
        <div className="weatherResult">
          <div className="resultBox">
            <h5>Temperature:</h5>
            <p>{temparature}C</p>
          </div>
        </div>
      }
      {error &&
        <div className="weatherResult">
          <div className="resultBox">
            <p>{error}</p>
          </div>
        </div>
      }

    </div>
  );
}

export default App;
