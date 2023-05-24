import "./widget.scss";
import React, { useState, useEffect } from 'react';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import OpacityIcon from '@mui/icons-material/Opacity';
import WindPowerIcon from '@mui/icons-material/WindPower';
import axios from "axios";

const Widget = ({ type, value }) => {
  let data ;
  const diff = 5;
  let temp = value;
  let humid = value;
  let [wind, setWind] = useState(value);
  let [condition, setCondition] = useState(null);

  const getWeatherData = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Ho Chi Minh&appid=9036b3e09ad902d33f97482be10154d7');
      const weatherData = response.data;
      const windSpeed = weatherData.wind.speed;
      setWind(windSpeed);
    } catch (error) {
      console.log(error);
    }
  };

  const getConditionData = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Ho Chi Minh&appid=9036b3e09ad902d33f97482be10154d7');
      const weatherData = response.data;
      const temperature = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const pressure = weatherData.main.pressure;
      const windSpeed = weatherData.wind.speed;
      const clouds = weatherData.clouds.all;
      const visibility = weatherData.visibility;
      setWind(windSpeed);
      const responsee = await axios.post('http://127.0.0.1:8000/api/v1/', {
        temperature: temperature,
        wind_speed: windSpeed,
        pressure: pressure,
        humidity: humidity,
        vis_km: visibility,
        cloud: clouds
      });
      const responseData = responsee.data;
      setCondition(responseData.Condition);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (type === "wind-speed") {
      getWeatherData();
    }
    if (type === "condition") {
      getConditionData();
    }
  }, []);

  switch (type) {
    case "temperature":
      data = {
        title: "Nhiệt độ",
        link: "Giá trị gần nhất",
        value: temp + ' °C',
        icon: (
          <ThermostatIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "humidity":
      data = {
        title: "Độ ẩm ",
        link: "Giá trị gần nhất",
        value: humid + " %",
        icon: (
          <OpacityIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "blue",
            }}
          />
        ),
      };
      break;
    case "wind-speed":
      data = {
        title: "Tốc độ gió",
        link: "Giá trị gần nhất",
        value: (wind * 3600 / 1000).toFixed(2) + ' km/h',
        icon: (
          <WindPowerIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "condition":
      data = {
        title: "Điều kiện",
        link: "Mô hình phân loại",
        value: condition,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.value}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
