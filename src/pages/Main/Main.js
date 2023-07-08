import "./Main.css";
import axios from "axios";
import UserService from "../../services/UserService";
import React, { useEffect} from "react";
import Navbar from "../../components/Navbar/Navbar";
import Chatbot from "./../chatbot/Chatbot";

const Main = () => {

//   useEffect(() => {

// // Hàm để gọi API và cập nhật dữ liệu
// const fetchLatestData = () => {
//   //const url = `https://api-weather-app.herokuapp.com/api`;
//   UserService.addLatest().then((response) => {
//     let data = null;
//     data = response.data;
//     console.log(response.data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }

// // Thực hiện gọi API lặp lại sau mỗi khoảng thời gian
// const intervalId = setInterval(() => {
//   fetchLatestData();
// }, 900000); // thực hiện lặp lại sau mỗi 15 phút (60000 miliseconds)

// // Xóa interval khi component bị unmount
// return () => clearInterval(intervalId);
//   })

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
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    
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

    // //const API_KEY = '9036b3e09ad902d33f97482be10154d7';
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    var input = document.getElementById("input");
    input.addEventListener("keydown", async function(e) {
      if (e.key === "Enter") {
        let location = document.getElementById("input").value;
        let text = location.toLowerCase();
        if (
          text === "ho chi minh" ||
          text === "sai gon" ||
          text === "ho chi minh city" ||
          text === "hồ chí minh"
        ) {
          let data = null;
          location = "Ho Chi Minh";
          text = "";
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}&lang=vi`;
    
          try {
            const response = await axios.get(url);
            data = response.data;
            console.log(response.data);
    
            const latestRecord = await UserService.getLatestRecord();
            console.log(latestRecord);
            data.main.humidity = latestRecord.data.humidity;
            data.main.temp = latestRecord.data.temperature;
            console.log(data.main.humidity);
            console.log(data.main.temp);
    
            showWeatherData(data, "Ho Chi Minh City");
            predictWeatherData2(data);
          } catch (err) {
            console.log(err);
          }
    
          location = "";
          document.getElementById("input").value = "";
        } else {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}&lang=vi`;
    
          try {
            const response = await axios.get(url);
            const data = response.data;
            showWeatherData(data, data.name);
            predictWeatherData2(data);
          } catch (err) {
            console.log(err);
          }
    
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
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&lang=vi`
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
      //let rain = data.rain["1h"];
      let rain;

      if (data.rain && data.rain["1h"]) {
        rain = data.rain["1h"];
      } else {
        rain = 0;
      }
      console.log(rain);
      countryEl.innerHTML = data.sys.country;
      coordinatesEl.innerHTML = data.coord.lat + "N " + data.coord.lon + "E";
      timezone.innerHTML = data.name;

      var classify = await UserService.ensampleClassify(
        //feels_like,
        temperature,
        wind_speed,
        pressure,
        humidity,
        rain,
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
            <p>Dự đoán</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cloud-sun-fill" viewBox="0 0 16 16">
                <path d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"/>
                <path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
            </svg>
        </div>
        <div className="object">
            <p>Vật dụng</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-umbrella-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394A3.166 3.166 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.484 3.484 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a2.958 2.958 0 0 1-.298 1.102 2.257 2.257 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.255 2.255 0 0 1-.763-.88 2.958 2.958 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a1.958 1.958 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a1.958 1.958 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.482 3.482 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5c-.149 0-.352-.145-.352-.145l-.004-.004a3.482 3.482 0 0 0-.58-.417A3.166 3.166 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.482 3.482 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Nên làm</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trời nắng") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Dự đoán</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
        </div>
        <div className="object">
            <p>Vật dụng</p>
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <path d="M393.2 180.3c-13.6-18.3-33.5-30.8-59.1-37.5-.7-8.1-5.1-18.6-18.7-21.1-13.7-2.5-21.9 6.1-25.4 14.5-12.6-.3-29.5 1-48.3 6.8-21.5 6.7-40.6 20.6-53.7 39.1-14.6 20.6-21.8 46.9-20.9 76l-67.5 53.4c-2 1.6-2.8 4.3-2 6.8.9 2.4 3.2 4 5.8 3.9.3 0 16.7.2 54 21.7 4.4 2.5 8.8 5.3 13.4 8.3 17.3 11.1 36.6 23.5 61.2 23.5 27.5 0 61.7-15.5 107.2-65.6 2.1.1 4.2.1 6.3.1 16.5 0 32-1.6 46.1-4.8 10.5-2.4 18.4-10.8 20.2-21.5 4.2-23.9 7.1-69.2-18.6-103.6zm-79.9-46.8c4.8.9 7.1 3.7 8.2 6.5-2.9-.5-5.8-.9-8.7-1.3-1.2-.3-4.5-1-9.5-1.6 1.8-2.4 4.9-4.5 10-3.6zm-68 21c31-9.6 56.6-5.7 63.2-4.4 2.3 2.8 8.4 11.3 12.3 28.7 4.7 20.8 7.1 57.8-8 117.3-58.9-7.4-117.7-32-133.7-39.1-1.4-59.8 33-92.2 66.2-102.5zM237 363.6c-23.5 1.8-41.8-10-59.6-21.4-4.6-2.9-9.3-5.9-13.9-8.6-21.2-12.2-36.2-18-46-20.8l56.6-44.8c19.6 8.7 85.3 36 149.6 41.3-32.8 34.6-61.2 52.4-86.7 54.3zM400.2 282c-1 5.9-5.3 10.5-11 11.8-15.8 3.6-33.6 5-52.8 4.3-3.8-.1-7.6-.4-11.5-.7 20.7-82.9 9.1-125.6-.6-144.6 26.3 5.5 46.2 17.1 59.3 34.6 23 30.9 20.3 72.5 16.6 94.6z" fill="currentColor" class="bi bi-sun-fill"></path>
            </svg>
        </div>
        <div className="Further">
            <p>Nên làm</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cart-dash-fill" viewBox="0 0 16 16">
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trời mưa") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Dự đoán</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-cloud-lightning-rain-fill" viewBox="0 0 16 16">
                <path d="M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.105-1.25A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2zm6.352-7.249a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973z"/>
            </svg>
        </div>
        <div className="object">
            <p>Vật dụng</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-umbrella-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394A3.166 3.166 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.484 3.484 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a2.958 2.958 0 0 1-.298 1.102 2.257 2.257 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.255 2.255 0 0 1-.763-.88 2.958 2.958 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a1.958 1.958 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a1.958 1.958 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.482 3.482 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5c-.149 0-.352-.145-.352-.145l-.004-.004a3.482 3.482 0 0 0-.58-.417A3.166 3.166 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.482 3.482 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0z"/>
            </svg>
        </div>
        <div className="Further">
            <p>Nên làm</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
            </svg>
        </div>`;
      } else if (classify.Condition === "Trong lành") {
        recommendEl.innerHTML = `
        <div className="classify">
            <p>Dự đoán</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
        </div>
        <div className="object">
            <p>Vật dụng</p>
            <svg viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="33" height="33">
                <path d="M12.663 2h6.845c.292 0 .559.118.752.312.192.192.312.458.312.75v1.593a1.062 1.062 0 0 1-1.064 1.064h-.13a22.042 22.042 0 0 1 2.04 4.582c.544 1.739.859 3.532.948 5.382v.018h.002v11.154c0 .016 0 .032-.002.048-.039.834-.244 1.532-.654 2.062-.426.552-1.055.905-1.923 1.03a.355.355 0 0 1-.057.005h-7.215c-.015 0-.031 0-.047-.002-.798-.034-1.399-.306-1.842-.773-.432-.46-.692-1.096-.818-1.875-.002-.021-.004-.041-.004-.062h-.002V15.736c0-.019 0-.035.002-.05.157-1.992.501-3.84 1-5.535a22.114 22.114 0 0 1 1.832-4.432 1.061 1.061 0 0 1-.724-.312 1.062 1.062 0 0 1-.313-.752V3.062c0-.292.119-.558.313-.75A1.05 1.05 0 0 1 12.663 2Zm5.877 3.858-5.091.036a21.184 21.184 0 0 0-1.884 4.48 26.161 26.161 0 0 0-.968 5.369v11.518c.102.604.296 1.087.606 1.417.298.317.72.502 1.294.524h7.21c.633-.095 1.082-.346 1.376-.724.305-.394.458-.939.488-1.611V15.701a20.535 20.535 0 0 0-.914-5.163 21.207 21.207 0 0 0-2.117-4.68Zm.968-3.063h-6.845a.266.266 0 0 0-.189.08.27.27 0 0 0-.08.189v1.593c0 .073.03.139.08.189a.27.27 0 0 0 .189.08h6.845c.073 0 .139-.03.189-.08a.27.27 0 0 0 .08-.189V3.062a.262.262 0 0 0-.08-.189.267.267 0 0 0-.189-.078Z" fill="#ffc040" fill-rule="nonzero" class="fill-32b2ff"></path><circle cx="13.5" cy="19.333" r="1" fill="#ffc040" class="fill-32b2ff"></circle><path d="M14.373 23.5a1.874 1.874 0 1 0 .001 3.747 1.874 1.874 0 0 0-.001-3.747Zm0 1a.874.874 0 1 1 0 1.748.874.874 0 0 1 0-1.748ZM19.066 18.833a1.925 1.925 0 1 0 1.923 1.924 1.925 1.925 0 0 0-1.923-1.924Zm0 1a.924.924 0 1 1-.001 1.847.924.924 0 0 1 .001-1.847ZM21.748 15.533c-.706-.269-1.619-.745-2.516-.961-.696-.167-1.384-.179-1.989.093-.262.117-.476.294-.683.476-.178.156-.339.335-.608.361-.306.03-.588-.116-.866-.271-.395-.221-.777-.478-1.148-.606-1.294-.446-2.665.299-3.691.961a.5.5 0 1 0 .542.84c.426-.275.918-.583 1.44-.773.449-.164.921-.242 1.382-.083.321.111.646.344.988.534.459.257.943.443 1.449.394.434-.042.748-.243 1.038-.489.179-.152.341-.331.566-.432.526-.236 1.143-.114 1.748.082.72.233 1.425.592 1.993.808a.5.5 0 1 0 .355-.934Z" fill="currentColor" class="bi bi-sun"></path></svg>
        </div>
        <div className="Further">
            <p>Nên làm</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-bicycle" viewBox="0 0 16 16">
                <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5zm1.5 2.443-.508.814c.5.444.85 1.054.967 1.743h1.139L5.5 6.943zM8 9.057 9.598 6.5H6.402L8 9.057zM4.937 9.5a1.997 1.997 0 0 0-.487-.877l-.548.877h1.035zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765l1.027-1.643zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53L11.55 8.623z"/>
            </svg>
        </div>`;
      }

      currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Nhiệt độ</div>
        <div>${temperature} &#176;C</div>
    </div>
    <div class="weather-item">
        <div>Tốc độ gió</div>
        <div>${((wind_speed * 3600) / 1000).toFixed(2)} kph</div>
    </div>
    <div class="weather-item">
        <div>Áp suất</div>
        <div>${pressure} mb</div>
    </div>
    <div class="weather-item">
        <div>Độ ẩm</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Tầm nhìn</div>
        <div>${visibility / 1000} km</div>
    </div>
    <div class="weather-item">
        <div>Mây</div>
        <div>${clouds} %</div>
    </div>


    <div class="weather-item">
        <div>Bình minh</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Hoàng hôn</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>

    `;
    }

    function kelvinToCelsius(kelvin) {
      return (kelvin - 273.15).toFixed(2);
    }
    function convertToVietnameseDay(day) {
      const daysInVietnamese = [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
      ];
    
      const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
      const index = englishDays.indexOf(day);
      if (index !== -1) {
        return daysInVietnamese[index];
      }
    
      return day; // Trả về ngày gốc nếu không tìm thấy ánh xạ
    }
    
    function predictWeatherData(data) {
      let otherDayForcast = '';
      data.daily.forEach((day, idx) => {
        const celsiusNight = kelvinToCelsius(day.temp.night);
        const celsiusDay = kelvinToCelsius(day.temp.day);
        const englishDay = window.moment(day.dt * 1000).format("dddd");
        const vietnameseDay = convertToVietnameseDay(englishDay);
    
        if (idx === 0) {
          currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${vietnameseDay}</div>
                <div class="temp">Đêm - ${celsiusNight}&#176;C</div>
                <div class="temp">Ngày - ${celsiusDay}&#176;C</div>
            </div>
          `;
        } else {
          otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${vietnameseDay}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Đêm - ${celsiusNight}&#176;C</div>
                <div class="temp">Ngày - ${celsiusDay}&#176;C</div>
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
                <p>Chào mừng đến với hệ thống dự báo thời tiết</p>
                <p>Tìm kiếm một địa điểm để khám phá sản phẩm của chúng tôi!</p>
              </div>
            </div>

            <div className="recommend" id="recommend">
              <div className="classify">
                <p>Trải nghiệm</p>
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
                <p>Chúc may mắn</p>
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
                <p>Khám phá</p>
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
                <input id="input" placeholder="Tìm tên thành phố" type="text" />
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
              <div className="day">Thứ hai</div>
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
          </div>

          <div className="weather-forecast" id="weather-forecast">
            <div className="weather-forecast-item">
              <div className="day">Thứ ba</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Thứ tư</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Thứ năm</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Thứ sáu</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Thứ bảy</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
            </div>
            <div className="weather-forecast-item">
              <div className="day">Chủ nhật</div>
              <img
                src="http://openweathermap.org/img/wn/10d@2x.png"
                alt="weather icon"
                className="w-icon"
              />
              <div className="temp">Đêm - 0&#176; C</div>
              <div className="temp">Ngày - 0&#176; C</div>
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
