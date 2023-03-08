import React from "react";
import "../App.css";
const InfoCard = ({ data, page }) => {
  const now = new Date();
  const timezoneOffset = data?.timezone;
  const localDate = new Date(now.getTime() + timezoneOffset);
  const timeString = localDate.toLocaleTimeString();
  return (
    <div className="data z-10 p-8 flex rounded-lg absolute md: translate-x-16 bg-white">
      <div>
        <h2> Country</h2>
        <h1>
          {data?.sys.country},{data?.name}
        </h1>
      </div>

      <div className="flex-grow">
        <h2>Time</h2>
        <h1>{timeString}</h1>
      </div>
      <div>
        <h2>Weather/Temp</h2>
        <img
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          alt="weather icon"
        ></img>{" "}
        <h1>{data.weather[0].main}</h1>
        <h1>{data.main.temp}F</h1>
      </div>
      <div>
        <h2>Description</h2>
        <h1>{data.weather[0].description}</h1>
      </div>
    </div>
  );
};

export default InfoCard;
