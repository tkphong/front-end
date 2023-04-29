import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import OpacityIcon from '@mui/icons-material/Opacity';
import WindPowerIcon from '@mui/icons-material/WindPower';


const Widget = ({ type,value}) => {
  let data;
  const diff = 5;
  let temp = value;
  let humid = value;
  let wind = value;
  switch (type) {
    case "temperature":
      data = {
        title: "Temperature",
        link: "Latest record",
        value:temp +  ' c',
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
        title: "Humidity ",
        link: "Latest record",
        value:humid +" %",
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
        title: "Wind Speed",
        link: "Latest record",
        value: (wind* 3600 / 1000).toFixed(2) + ' km/h',
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
        title: "Condition",
        link: "Model's classification",
        value:"Good",
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
        <span className="counter">
            {data.value} 
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
      
    </div>
  );

  
};

export default Widget;
