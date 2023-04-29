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
          <span className="logo">MDP</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Start Page</p>
          <Link to="/" style={{ textDecoration: "none" }}>
              <li>
                <DashboardIcon className="icon" />
                <span>Start</span>
              </li>
          </Link>
          
          <p className="title">Main Page</p>
          <Link to="/main" style={{ textDecoration: "none" }}>
            <li>
              <ArrowCircleLeftIcon className="icon" />
              <span>Main</span>
            </li>
          </Link>
          
          <p className="title">About Page</p>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <li>
              <InfoIcon className="icon" />
              <span>About Us</span>
            </li>
          </Link>
         
          
          <p className="title">Others</p>
          <a href="https://github.com/CIYech" target="_blank" rel="noreferrer">
            <li>
              <GitHubIcon className="icon" />
              <span>Github</span>
            </li>
          </a>
          
          <a href="https://drive.google.com/drive/folders/1B2Qb2bKfFQWWnpA_nDpCM93MIJ_YPFgU" target="_blank" rel="noreferrer">
            <li>
              <AddToDriveIcon className="icon" />
              <span>Google Drive</span>
            </li>
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
