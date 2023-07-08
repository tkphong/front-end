import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import "./MultiLineChart.css";
import UserService from '../../../services/UserService';
import axios from 'axios';

const LineData = [
  ['x', 'temperature', 'humidity','wind-speed'],
  [0, 0, 0, 0],
  [1, 10, 5, 6],
  [2, 23, 15, 10],
  [3, 17, 9, 9],
  [4, 18, 10, 4],
  [5, 9, 5, 7],
  [6, 11, 3, 6],
  [7, 27, 19, 7],
]

const getWeatherData = async () => {

  try {
    //const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ location +'&appid=9036b3e09ad902d33f97482be10154d7';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=Ho Chi Minh&appid=9036b3e09ad902d33f97482be10154d7';
    console.log(url);
    const response = await axios.get(url);
    const weatherData = response.data;
    const windSpeed = weatherData.wind.speed;
    return windSpeed;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const LineChartOptions = {
  hAxis: {
    title: 'Thời gian (30 giá trị gần đây nhất)',
  },
  vAxis: {
    title: 'Giá trị',
  },
  series: {
    1: { curveType: 'function' },
  },
};

const MultiLineChart = () => {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await getWeatherData();
        if (weatherData !== null) {
          UserService.getRecordList()
            .then((response) => {
              const data = response.data;
              const chartData = [['x', 'Nhiệt Độ', 'Độ Ẩm', 'Tốc Độ Gió']];
              for (let i = 0; i < data.length; i++) {
                const humidity = data[i].humidity;
                const temperature = data[i].temperature;
                const windSpeed = (weatherData * 3600) / 1000;

                chartData.push([i, humidity, temperature, windSpeed]);
              }

              setChartData(chartData);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (chartData === null) {
    return (
      <div className="linechart">
        <h2 className='title-linechart'>Biểu đồ đường các giá trị theo thời gian</h2>
        <Chart
          width={'50rem'}
          height={'30rem'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={LineData}
          options={LineChartOptions}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
    );
  } else {
    return (
      <div className="linechart">
        <h2 className='title-linechart'>Biểu đồ đường các giá trị theo thời gian</h2>
        <Chart
          width={'50rem'}
          height={'30rem'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={LineChartOptions}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
    );
  }
};

export default MultiLineChart;