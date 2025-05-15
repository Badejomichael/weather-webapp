import '../App.css';
import { useQuery } from '@tanstack/react-query';

import sunnyIcon from "../assets/sunny.jpg";
import cloudyIcon from "../assets/cloudy.jpg";
import rainyIcon from "../assets/rainy.jpg";
import thunderIcon from "../assets/thunder.jpg";
import drizzleIcon from "../assets/drizzle.jpg";



export const Home = ({selectedCity}) => {
  const openWeatherApiKey = process.env.REACT_APP_API_KEY;

  const fetchWeather = async ({ name }) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${openWeatherApiKey}`
    );
    if (!res.ok) {
      throw new Error("City not found")
    }
    return res.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weather", selectedCity],
    enabled: !!selectedCity,
    queryFn: () => fetchWeather(selectedCity),
  });

  // Function to determine the weather image to display

   const weatherCondition = data?.weather[0].main;
   const getWeatherImage = (weatherCondition) => {
     switch (weatherCondition?.toLowerCase()) {
       case 'clouds':
       case 'cloudy':
         return (cloudyIcon);
       case 'rain':
         return (rainyIcon);
       case 'drizzle':
         return (drizzleIcon);
       case 'thunderstorm':
         return (thunderIcon);
       case 'clear':
       case 'sunny':
         return (sunnyIcon);
       default:
         return null;
     }
   };

    const weatherImage = getWeatherImage(weatherCondition);

    // --- 2. 3-Hour Forecast (Today) ---
  const fetchThreeHourForecast = async ({ name }) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&appid=${openWeatherApiKey}`
    );
    const forecast = await res.json();

    const today = new Date().toISOString().split("T")[0];
    return forecast.list.filter((entry) =>
      entry.dt_txt.startsWith(today)
    );
  };

  const { data: threeHourForecast = [], isLoading: loadingForecast } = useQuery({
    queryKey: ["three-hour-forecast", selectedCity],
    enabled: !!selectedCity,
    queryFn: () => fetchThreeHourForecast(selectedCity),
  });

   // --- 3. 5-Day Forecast using One Call API ---
  const fetchFiveDayForecast = async ({ name }) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&appid=${openWeatherApiKey}`
  );
  const data = await res.json();

  // Pick one forecast per day at 12:00:00
  const dailyForecasts = {};
    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      const time = entry.dt_txt.split(" ")[1];

      if (time === "12:00:00" && !dailyForecasts[date]) {
        dailyForecasts[date] = entry;
      }
  });

  return Object.values(dailyForecasts);
};

const {
  data: fiveDayForecast = [],
  isLoading: loadingFiveDayForecast,
} = useQuery({
  queryKey: ["five-day-forecast", selectedCity],
  enabled: !!selectedCity,
  queryFn: () => fetchFiveDayForecast(selectedCity),
});


 
  // when data is loading
  if (isLoading || loadingForecast || loadingFiveDayForecast) {
    return (
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    )
  }

  // when a city isn't found upon search or there's an error
  if (isError) {
    return <h2 className="error-message">{error.message}</h2>
  }

  return (
    <div className="general-container">
      
      <div className="sub-container-1 container">
        <div className="hero-container container">
          <div>
            <h1>{data?.name}</h1>
            <h2>{data?.main?.temp}°C</h2>
            <p>{data?.weather[0].main} ({data?.weather[0].description})</p>
            <p>{data?.rain?.["1h"] ? `Rainfall: ${data.rain["1h"]} mm in last hour` : `Cloud Cover: ${data?.clouds?.all}%`}</p>
          </div>

          <div className="weather-icon-div">
          <img src={weatherImage} alt="Weather Condition" className="weather-icon" />
          </div>
        </div>

        <div className="hourly-forecast container">
          <h3>Today’s Hourly Forecast (Every 3 Hours)</h3>
          <div className="hourly-forecast-container">
            {threeHourForecast.map((entry, index) => (
            <div className="hourly-forecast-card" key={index}>
              {entry.dt_txt.split(" ")[1]} - {entry.weather[0].main}, {entry.main.temp}°C
            </div>
          ))}
          </div>
        </div>
      </div>
      
      <div className="daily-forecast container">
        <h2>5-Day Forecast</h2>
        {fiveDayForecast.length > 0 && (
          <div className="container">
            <div className="forecast-grid">
              {fiveDayForecast.map((entry, index) => {
                const date = new Date(entry.dt * 1000).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                const { description } = entry.weather[0];
                const temp = entry.main.temp;

                 // Function to determine the days weather forecast image to display

                const dayWeatherCondition = entry?.weather[0].main;
                const getDayWeatherImage = (dayWeatherCondition) => {
                  switch (dayWeatherCondition?.toLowerCase()) {
                    case 'clouds':
                    case 'cloudy':
                      return (cloudyIcon);
                    case 'rain':
                      return (rainyIcon);
                    case 'drizzle':
                      return (drizzleIcon);
                    case 'thunderstorm':
                      return (thunderIcon);
                    case 'clear':
                    case 'sunny':
                      return (sunnyIcon);
                    default:
                      return null;
                  }
                };

                  const dayWeatherImage = getDayWeatherImage(dayWeatherCondition);

                return (
                  <div className="five-days-forecast-card" key={index}>
                    <p className="date">{date}</p>
                    <img
                      src={dayWeatherImage}
                      alt={description}
                      className="forecast-weather-icon"
                    />
                    <p className="desc">{description}</p>
                    <p className="temp">{Math.round(temp)}°C</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}