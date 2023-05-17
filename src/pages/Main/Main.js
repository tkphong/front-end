import "./Main.css";
import axios from "axios";
import UserService from "../../services/UserService";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Chatbot from "./../chatbot/Chatbot";
const Main = () => {
  useEffect(() => {

// Hàm để gọi API và cập nhật dữ liệu
const fetchLatestData = () => {
  //const url = `https://api-weather-app.herokuapp.com/api`;
  UserService.addLatest().then((response) => {
    let data = null;
    data = response.data;
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
}

// Thực hiện gọi API lặp lại sau mỗi khoảng thời gian
const intervalId = setInterval(() => {
  fetchLatestData();
}, 900000); // thực hiện lặp lại sau mỗi 15 phút (60000 miliseconds)

// Xóa interval khi component bị unmount
return () => clearInterval(intervalId);
  })

  useEffect(() => {
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    const currentWeatherItemsEl = document.getElementById(
      "current-weather-items"
    );
    const timezone = document.getElementById("time-zone");
    const countryEl = document.getElementById("country");
    const coordinatesEl = document.getElementById("coordinates");
    const weatherForecastEl = document.getElementById("weather-forecast");
    const currentTempEl = document.getElementById("current-temp");
    const recommendEl = document.getElementById("recommend");
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
     ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    //const API_KEY = '9036b3e09ad902d33f97482be10154d7';
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    setInterval(() => {
      const time = new Date();
      const month = time.getMonth();
      const date = time.getDate();
      const day = time.getDay();
      const hour = time.getHours();
      const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
      const minutes = time.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";

      timeEl.innerHTML =
        (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ` <span id="am-pm">${ampm}</span>`;
      dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
    }, 1000);
    
/* Ho Chi Minh ko hien thi nhung co data */
    var input = document.getElementById("input");
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        let location = document.getElementById("input").value;
        let text = location.toLowerCase();
        if (
          text === "ho chi minh" ||
          text === "sai gon" ||
          text === "ho chi minh city"
        ) {
          let data = null;
          location = "Ho Chi Minh";
          text = "";
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
          //const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7`;
          axios.get(url).then((response) => {
            data = response.data;
            console.log(response.data);
          });

          UserService.getLatestRecord()
            .then((response) => {
              // console.log(response);
              data.main.humidity = response.data.humidity;
              //data.main.feels_like = response.data.temperature;
              data.main.temp = response.data.temperature;
              //data.wind.speed = response.data.windSpeed;
              showWeatherData(data, "Ho Chi Minh City");
              predictWeatherData2(data);
            })
            .catch((err) => {
              console.log(err);
            });
          location = "";
          document.getElementById("input").value = "";
        } else {
          //const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7`;
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
          axios.get(url).then((response) => {
            let data = response.data;
            showWeatherData(data, data.name);
            predictWeatherData2(data);
          });
          location = "";
          document.getElementById("input").value = "";
        }
      }
    });


    function predictWeatherData2(obj) {
      let latitude = obj.coord.lat;
      let longitude = obj.coord.lon;
      fetch(
        //`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        //  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log("here: ",data);
          predictWeatherData(data);
        });
    }

    async function showWeatherData(data, place) {
      let humidity = data.main.humidity;
      let pressure = data.main.pressure;
      let sunrise = data.sys.sunrise;
      let sunset = data.sys.sunset;
      let wind_speed = data.wind.speed;
      //let feels_like = data.main.feels_like;
      let temperature = data.main.temp;
      let visibility = data.visibility;
      let clouds = data.clouds.all;
      countryEl.innerHTML = data.sys.country;
      coordinatesEl.innerHTML = data.coord.lat + "N " + data.coord.lon + "E";
      timezone.innerHTML = data.name;

      var classify = await UserService.ensampleClassify(
        //feels_like,
        temperature,
        wind_speed,
        pressure,
        humidity,
        visibility,
        clouds
      );
      localStorage.setItem(
        place,
        JSON.stringify({
          //temp: data.main.feels_like,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          classify: classify["Condition"],
        })
      );

      if (classify.Condition === "Có mây") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Classify</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cloud-sun-fill" viewBox="0 0 16 16">
                <path d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"/>
                <path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
            </svg>
        </div>
        <div className="object">
            <p>Object</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Should do</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trời nắng") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Classify</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
        </div>
        <div className="object">
            <p>Object</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-sunglasses" viewBox="0 0 16 16">
                <path d="M3 5a2 2 0 0 0-2 2v.5H.5a.5.5 0 0 0 0 1H1V9a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3 1 1 0 1 1 2 0 3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-.5h.5a.5.5 0 0 0 0-1H15V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-1.888 1.338A1.99 1.99 0 0 0 8 6a1.99 1.99 0 0 0-1.112.338A2 2 0 0 0 5 5H3zm0 1h.941c.264 0 .348.356.112.474l-.457.228a2 2 0 0 0-.894.894l-.228.457C2.356 8.289 2 8.205 2 7.94V7a1 1 0 0 1 1-1z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Should do</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cart-dash-fill" viewBox="0 0 16 16">
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trời mưa") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Classify</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cloud-lightning-rain-fill" viewBox="0 0 16 16">
                <path d="M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.105-1.25A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2zm6.352-7.249a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973z"/>
            </svg>
        </div>
        <div className="object">
            <p>Object</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-umbrella-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394A3.166 3.166 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.484 3.484 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a2.958 2.958 0 0 1-.298 1.102 2.257 2.257 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.255 2.255 0 0 1-.763-.88 2.958 2.958 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a1.958 1.958 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a1.958 1.958 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.482 3.482 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5c-.149 0-.352-.145-.352-.145l-.004-.004a3.482 3.482 0 0 0-.58-.417A3.166 3.166 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.482 3.482 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Should do</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trong lành") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Classify</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
        </div>
        <div className="object">
            <p>Object</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
                <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
                <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Should do</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-bicycle" viewBox="0 0 16 16">
                <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5zm1.5 2.443-.508.814c.5.444.85 1.054.967 1.743h1.139L5.5 6.943zM8 9.057 9.598 6.5H6.402L8 9.057zM4.937 9.5a1.997 1.997 0 0 0-.487-.877l-.548.877h1.035zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765l1.027-1.643zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53L11.55 8.623z"/>
            </svg>
        </div>`;
      }

      currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Temperature</div>
        <div>${temperature} &#176;C</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${((wind_speed * 3600) / 1000).toFixed(2)} kph</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} mb</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Visibility</div>
        <div>${visibility / 1000} km</div>
    </div>
    <div class="weather-item">
        <div>Clouds</div>
        <div>${clouds} %</div>
    </div>


    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>

    `;
    }

    function kelvinToCelsius(kelvin) {
      return (kelvin - 273.15).toFixed(2);
    }

    function predictWeatherData(data) {
      let otherDayForcast = '';
      data.daily.forEach((day, idx) => {
        const celsiusNight = kelvinToCelsius(day.temp.night);
        const celsiusDay = kelvinToCelsius(day.temp.day);
    
        if (idx === 0) {
          currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night - ${celsiusNight}&#176;C</div>
                <div class="temp">Day - ${celsiusDay}&#176;C</div>
            </div>
          `;
        } else {
          otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${celsiusNight}&#176;C</div>
                <div class="temp">Day - ${celsiusDay}&#176;C</div>
            </div>
          `;
        }
      });
      weatherForecastEl.innerHTML = otherDayForcast;
    }
    
  }, []);
  return (
    <div>
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="current-info">
            <div className="date-container">
              <div className="time" id="time">
                00:00
                <span id="am-pm">AM</span>
              </div>
              <div className="date" id="date">
                Monday, 25 March
              </div>

              <div className="others" id="current-weather-items">
                <p>Welcome to weather forecast.</p>
                <p>Search a location to explore our product!</p>
              </div>
            </div>

            <div className="recommend" id="recommend">
              <div className="classify">
                <p>Try out</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-hand-thumbs-up-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                </svg>
              </div>
              <div className="object">
                <p>Good luck</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-arrow-through-heart"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.854 15.854A.5.5 0 0 1 2 15.5V14H.5a.5.5 0 0 1-.354-.854l1.5-1.5A.5.5 0 0 1 2 11.5h1.793l.53-.53c-.771-.802-1.328-1.58-1.704-2.32-.798-1.575-.775-2.996-.213-4.092C3.426 2.565 6.18 1.809 8 3.233c1.25-.98 2.944-.928 4.212-.152L13.292 2 12.147.854A.5.5 0 0 1 12.5 0h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.854.354L14 2.707l-1.006 1.006c.236.248.44.531.6.845.562 1.096.585 2.517-.213 4.092-.793 1.563-2.395 3.288-5.105 5.08L8 13.912l-.276-.182a21.86 21.86 0 0 1-2.685-2.062l-.539.54V14a.5.5 0 0 1-.146.354l-1.5 1.5Zm2.893-4.894A20.419 20.419 0 0 0 8 12.71c2.456-1.666 3.827-3.207 4.489-4.512.679-1.34.607-2.42.215-3.185-.817-1.595-3.087-2.054-4.346-.761L8 4.62l-.358-.368c-1.259-1.293-3.53-.834-4.346.761-.392.766-.464 1.845.215 3.185.323.636.815 1.33 1.519 2.065l1.866-1.867a.5.5 0 1 1 .708.708L5.747 10.96Z"
                  />
                </svg>
              </div>
              <div className="Further">
                <p>Explore</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-arrow-up-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                  />
                </svg>
              </div>
            </div>

            <div className="place-container">
              <div className="time-zone" id="time-zone">

              </div>
              <div id="coordinates" className="coordinates"></div>
              <div id="country" className="country">

              </div>
              <div className="search" id="search">
                <input id="input" placeholder="Input a location" type="text" />
              </div>
            </div>

          </div>
        </div>

        <div className="future-forecast">
          <div className="today" id="current-temp">
            <img
              src="http://openweathermap.org/img/wn/10d@2x.png"
              alt="weather icon"
              className="w-icon"
            />
            <div className="other">
              <div className="day">Monday</div>
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
          </div>

          <div className="weather-forecast" id="weather-forecast">
            <div className="weather-forecast-item">
              <div className="day">Tue</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Wed</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Thur</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Fri</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Sat</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Sun</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Night - 0&#176; C</div>
              <div className="temp">Day - 0&#176; C</div>
            </div>
          </div>
        </div>

        <Chatbot />

        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
          integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </div>
    </div>
  );
};
export default Main;
