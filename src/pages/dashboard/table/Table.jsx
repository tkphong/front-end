import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import React, {useEffect,useState } from 'react';
import UserService from "../../../services/UserService";

var rows = [{
  id: 1,
  temp:  "0 degree C",
  location: "Ho Chi Minh city",
  date: "2022" }];

const List = () => {
  const [table_state, setTable_state] = useState(null);
  useEffect(() => {
    let today = new Date();
    let time_stamp = [];
    let cur_hour = today.getHours();
    //let cur_min = today.getMinutes();
    UserService.getPredictNextHour().then((response)=>{
      for (let i = 0; i < 6; i++) {
        // if (cur_min < 30){
        //   cur_min += 30;
        // }
        // else{
        //   cur_min = (cur_min + 30)%60;
        //   if (cur_hour === 23){
        //     cur_hour = 0;
        //   }
        //   else{
        //     cur_hour +=1;
        //   }
        // }
        if (cur_hour+1 <= 23){
          cur_hour +=1;
        }
        else{
          cur_hour = 0;
        }
        time_stamp[i] = cur_hour + ":00" ;

        rows[i] = {
          id: time_stamp[i],
          temp: response.data[i].temperature + " C",
          location: "Thành phố Hồ Chí Minh",
          date: today.getDate()+ " / "+ (today.getMonth()+1) +" / " + today.getFullYear()
        }
      }
      setTable_state(response.data);
    }).catch(err=>console.log(err));
    
  },[])
  if (table_state ===null){
    return (
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Mốc thời gian</TableCell>
              <TableCell className="tableCell">Nhiệt độ dự kiến</TableCell>
              <TableCell className="tableCell">Vị trí</TableCell>
              <TableCell className="tableCell">Ngày</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                  <ThermostatIcon
                    className="icon"
                    style={{
                      color: "crimson",
                      backgroundColor: "rgba(255, 0, 0, 0.2)",
                     }}
                  />
                    {row.temp}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.location}</TableCell>
                <TableCell className="tableCell">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  else{
    return (
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Mốc thời gian</TableCell>
              <TableCell className="tableCell">Nhiệt độ dự kiến</TableCell>
              <TableCell className="tableCell">Vị trí</TableCell>
              <TableCell className="tableCell">Ngày</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                  <ThermostatIcon
                    className="icon"
                    style={{
                      color: "crimson",
                      backgroundColor: "rgba(255, 0, 0, 0.2)",
                     }}
                  />
                    {row.temp}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.location}</TableCell>
                <TableCell className="tableCell">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
};

export default List;
