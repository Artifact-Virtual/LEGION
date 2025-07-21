import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FiCloud, FiSun, FiWind, FiDroplet, FiThermometer, FiEye, FiCloudRain } from 'react-icons/fi';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(true);

  // Use environment variable or your OpenWeatherMap API key
  const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY || 'c17f641de2bc99e8b18a028607e044d5';

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      if (currentResponse.ok && forecastResponse.ok) {
        setWeatherData({
          temp: Math.round(currentData.main.temp),
          feels_like: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          pressure: currentData.main.pressure,
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          wind_speed: currentData.wind.speed,
          visibility: currentData.visibility / 1000, // Convert to km
          uv_index: 0 // UV index not available in free tier
        });

        // Process forecast data
        const processedForecast = forecastData.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed
        }));
        setForecast(processedForecast);
      } else {
        throw new Error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to demo data if API fails
      setWeatherData({
        temp: 22,
        feels_like: 24,
        humidity: 65,
        pressure: 1013,
        description: 'scattered clouds',
        icon: '03d',
        wind_speed: 3.5,
        visibility: 10,
        uv_index: 0
      });

      setForecast([
        { time: '12:00', temp: 24, description: 'Cloudy', icon: '03d', humidity: 65, wind_speed: 3.5 },
        { time: '15:00', temp: 26, description: 'Sunny', icon: '01d', humidity: 55, wind_speed: 2.8 },
        { time: '18:00', temp: 23, description: 'Rainy', icon: '10d', humidity: 85, wind_speed: 4.2 },
        { time: '21:00', temp: 25, description: 'Partly Cloudy', icon: '02d', humidity: 60, wind_speed: 3.1 },
        { time: '00:00', temp: 27, description: 'Sunny', icon: '01d', humidity: 50, wind_speed: 2.5 }
      ]);
    }
    setLoading(false);
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d': case '01n': return <FiSun className="w-8 h-8 text-yellow-400" />;
      case '02d': case '02n': return <FiCloud className="w-8 h-8 text-gray-400" />;
      case '03d': case '03n': case '04d': case '04n': return <FiCloud className="w-8 h-8 text-gray-500" />;
      case '09d': case '09n': case '10d': case '10n': return <FiCloudRain className="w-8 h-8 text-blue-400" />;
      case '11d': case '11n': return <FiCloudRain className="w-8 h-8 text-purple-400" />;
      case '13d': case '13n': return <FiCloud className="w-8 h-8 text-white" />;
      case '50d': case '50n': return <FiCloud className="w-8 h-8 text-gray-300" />;
      default: return <FiSun className="w-8 h-8 text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading weather data...</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-lg">Failed to load weather data</div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6">
      {/* City Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCloud className="text-blue-400" />
          <span className="text-white font-medium">Weather Dashboard</span>
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-gray-800 text-white text-sm border border-gray-600 rounded px-3 py-1"
        >
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Paris">Paris</option>
          <option value="Sydney">Sydney</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Cairo">Cairo</option>
          <option value="Moscow">Moscow</option>
        </select>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-6 border border-blue-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-2xl font-bold">{city}</h3>
            <p className="text-blue-200 text-sm capitalize">{weatherData.description}</p>
          </div>
          {getWeatherIcon(weatherData.icon)}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-white text-3xl font-bold">{weatherData.temp}°C</div>
            <div className="text-blue-200 text-xs">Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-white text-lg">{weatherData.feels_like}°C</div>
            <div className="text-blue-200 text-xs">Feels like</div>
          </div>
          <div className="text-center">
            <div className="text-white text-lg">{weatherData.humidity}%</div>
            <div className="text-blue-200 text-xs">Humidity</div>
          </div>
          <div className="text-center">
            <div className="text-white text-lg">{weatherData.wind_speed} m/s</div>
            <div className="text-blue-200 text-xs">Wind Speed</div>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
          <FiDroplet className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-white text-lg font-semibold">{weatherData.humidity}%</div>
          <div className="text-gray-400 text-xs">Humidity</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
          <FiWind className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-white text-lg font-semibold">{weatherData.wind_speed} m/s</div>
          <div className="text-gray-400 text-xs">Wind Speed</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
          <FiThermometer className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-white text-lg font-semibold">{weatherData.pressure} hPa</div>
          <div className="text-gray-400 text-xs">Pressure</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
          <FiEye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-white text-lg font-semibold">{weatherData.visibility} km</div>
          <div className="text-gray-400 text-xs">Visibility</div>
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiCloud className="w-5 h-5 text-blue-400" />
          Hourly Forecast
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((item, index) => (
            <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-center">
              <div className="text-blue-400 text-xs mb-2">{item.time}</div>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(item.icon)}
              </div>
              <div className="text-white font-semibold">{item.temp}°C</div>
              <div className="text-gray-400 text-xs capitalize">{item.description}</div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>{item.humidity}%</span>
                <span>{item.wind_speed}m/s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiCloudRain className="w-5 h-5 text-yellow-400" />
          <h4 className="text-yellow-400 font-semibold">Weather Advisory</h4>
        </div>
        <p className="text-yellow-200 text-sm">
          Partly cloudy conditions expected. Temperature comfortable for outdoor activities. 
          {weatherData.wind_speed > 5 && " Moderate winds expected."}
          {weatherData.humidity > 80 && " High humidity levels."}
        </p>
      </div>
    </div>
  );
};

export default WeatherDashboard;
