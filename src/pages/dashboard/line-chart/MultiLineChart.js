import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import UserService from '../../../services/UserService';
import "./MultiLineChart.css";

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
const LineChartOptions = {
  hAxis: {
    title: 'Time (30 most recent record)',
  },
  vAxis: {
    title: 'Value',
  },
  series: {
    1: { curveType: 'function' },
  },
}
var  result = [['x', 'temperature', 'humidity','wind-speed']];
const MultiLineChart = () => {
  const [chart_state, setChart_state] = useState(null); 
  useEffect(() => {
   
    UserService.getRecordList().then((response)=>{
      var i = 0;
      while(i < response.data.length){
        result.push([])
        result[result.length-1].push(i);
        result[result.length-1].push(response.data[i].temperature);
        result[result.length-1].push(response.data[i].humidity);
        result[result.length-1].push(response.data[i].windSpeed);
        i++
      }
      setChart_state(result);
    }).catch(err=>console.log(err))  
  }, [])
  if(chart_state === null){
    return (
      <div className="linechart">
        <h2 className='title-linechart'>Line chart of sensors over time</h2>
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
    )
  }
  else{
    return (
      <div className="linechart">
        <h2 className='title-linechart'>Line chart of sensors over time</h2>
        <Chart
          width={'50rem'}
          height={'30rem'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={result}
          options={LineChartOptions}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
    )
  }
}


export default MultiLineChart