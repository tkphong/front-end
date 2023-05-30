import Sidebar from "./sidebar/Sidebar";
import "./dashboard.scss";
import Widget from "./widget/Widget";
import MultiLineChart from "./line-chart/MultiLineChart";
import Table from "./table/Table";
import React, { useState, useEffect } from 'react';
import UserService from "../../services/UserService";

const  Dashboard = () => {
  // var islocation = localStorage.getItem(islocat);
  // if(islocation===undefined||islocat===null)
  // {
  //   islocation=true;
  // }
  const [widget_res, setWidget_res] = useState(null); 
  var humid=0;
  var temp=0;
  var wind=0;
  useEffect(() => {
    UserService.getLatestRecord().then((response)=>{
      // console.log('response: ',response);
      setWidget_res(response.data);
    }).catch(err=>console.log(err))  
  }, [])
  if(widget_res === null){
    return (
      <div className="dashboard" >
        <Sidebar />
        <div className="dashboardContainer">
          <div className="widgets" id="widgets">
            <Widget type="temperature" value={temp} />
            <Widget type="humidity" value={humid}/>
            <Widget type="wind-speed" value={wind}/>
            <Widget type="condition" />
          </div>
          <div className="charts">
            <MultiLineChart/>
          </div>

          <div className="listContainer">
            <div className="listTitle">Dự đoán nhiệt độ</div>
            <Table />
          </div>
        </div>
      </div>
     
    );
  }
  else{
    return (
      <div className="dashboard" >
        <Sidebar />
        <div className="dashboardContainer">
          <div className="widgets" id="widgets">
            <Widget type="temperature" value={widget_res.temperature} />
            <Widget type="humidity" value={widget_res.humidity}/>
            <Widget type="wind-speed" value={widget_res.windSpeed}/>
            <Widget type="condition" />
          </div>
          <div className="charts">
            <MultiLineChart/>
          </div>
          <div className="listContainer">
            <div className="listTitle">Dự đoán nhiệt độ</div>
            <Table />
          </div>
        </div>
      </div>
    );
    
  }
};

export default Dashboard;
