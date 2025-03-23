'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { BsList } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaCloud, FaSun, FaCloudRain, FaCloudShowersHeavy, FaSnowflake } from "react-icons/fa";
import CloudBackground from "./components/CloudBackground";
import Sidebar from "./components/Sidebar";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

interface FavoriteCity {
  id: string;
  cityName: string;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const loadedFavorites = JSON.parse(savedFavorites);
      setFavorites(loadedFavorites);
      // If there are favorites, load the first one
      if (loadedFavorites.length > 0) {
        fetchWeather(loadedFavorites[0].cityName);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_WEATHER_KEY) {
        throw new Error('Weather API key is not configured');
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Invalid API key. Please check your OpenWeatherMap API key configuration.');
          alert('Weather API key is invalid. Please check the configuration.');
        } else if (error.response?.status === 404) {
          console.error('City not found');
          alert('Byen ble ikke funnet. Vennligst sjekk bynavnet og prøv igjen.');
        } else {
          console.error('Error fetching weather:', error.message);
          alert('Feil ved henting av værdata. Vennligst prøv igjen senere.');
        }
      } else {
        console.error('Error:', error);
        alert('En uventet feil oppstod. Vennligst prøv igjen senere.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (cityName: string) => {
    if (!favorites.some(f => f.cityName === cityName)) {
      const newFavorite = {
        id: Date.now().toString(),
        cityName
      };
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFromFavorites = (cityName: string) => {
    setFavorites(prev => prev.filter(city => city.cityName !== cityName));
  };

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain) {
      case 'Clear':
        return <FaSun className="text-yellow-400 text-6xl" />;
      case 'Clouds':
        return <FaCloud className="text-gray-400 text-6xl" />;
      case 'Rain':
        return <FaCloudRain className="text-blue-400 text-6xl" />;
      case 'Thunderstorm':
        return <FaCloudShowersHeavy className="text-gray-600 text-6xl" />;
      case 'Snow':
        return <FaSnowflake className="text-blue-200 text-6xl" />;
      default:
        return <FaCloud className="text-gray-400 text-6xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 p-4 md:p-8 relative">
      <CloudBackground />
      <div className="max-w-2xl mx-auto relative z-30">
        <div className="flex justify-between items-center mb-20 mt-8 md:mt-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                console.log('Opening sidebar');
                setIsSidebarOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              aria-label="Open favorites"
            >
              <BsList size={24} className="text-white" />
            </button>
            <h1 className="text-4xl font-bold text-white">Cloudify</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              aria-label="Settings"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white mt-8">Loading...</div>
        ) : weather ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-[50px] p-8 shadow-lg overflow-hidden weather-card mt-8"
          >
            {/* Cloud shape using pseudo-elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg- rounded-full"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-900">{weather.name}</h2>
                {!favorites.some(f => f.cityName === weather.name) && (
                  <button
                    onClick={() => addToFavorites(weather.name)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition-colors"
                  >
                    Legg til i favoritter
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-center mb-6">
                {getWeatherIcon(weather.weather[0].main)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold">Temperatur</p>
                  <p className="text-2xl text-blue-900">{Math.round(weather.main.temp)}°C</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold">Føles som</p>
                  <p className="text-2xl text-blue-900">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold">Luftfuktighet</p>
                  <p className="text-2xl text-blue-900">{weather.main.humidity}%</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold">Vindhastighet</p>
                  <p className="text-2xl text-blue-900">{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-white mt-12">
            <p className="text-xl">Velkommen til Cloudify</p>
            <p className="mt-2">Åpne sidefeltet for å søke etter en by og legge den til i favoritter</p>
          </div>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          console.log('Closing sidebar');
          setIsSidebarOpen(false);
        }}
        favorites={favorites}
        onSelectCity={fetchWeather}
        onRemoveFavorite={removeFromFavorites}
        onAddFavorite={addToFavorites}
      />
    </div>
  );
}
