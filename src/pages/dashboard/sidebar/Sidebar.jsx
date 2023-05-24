import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Link } from "react-router-dom";

const Sidebar = () => {
  
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">WFS</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Trang bắt đầu </p>
          <Link to="/" style={{ textDecoration: "none" }}>
              <li>
                <DashboardIcon className="icon" />
                <span>Start</span>
              </li>
          </Link>
          
          <p className="title">Trang chủ</p>
          <Link to="/main" style={{ textDecoration: "none" }}>
            <li>
              <ArrowCircleLeftIcon className="icon" />
              <span>Main</span>
            </li>
          </Link>
          
          <p className="title">Trang thành viên</p>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <li>
              <InfoIcon className="icon" />
              <span>About Us</span>
            </li>
          </Link>

          
          <p className="title">Khác</p>
          <a href="https://github.com/CIYech" target="_blank" rel="noreferrer">
            <li>
              <GitHubIcon className="icon" />
              <span>Github</span>
            </li>
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
