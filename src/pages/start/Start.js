import React from 'react';
import './Start.css';
import pic from "./hcmus.jpg";
import { Link } from 'react-router-dom';
const Start =() =>{
    return (
        <div className="bgimg">
        <div className="topleft">
          <img src={pic} alt="HCMUS" width="100" height="100" />
        </div>
        <div className="middle">
          <h1>WEATHER REPORTING &amp; FORECASTING SYSTEM <hr /></h1>
          
          <button className="button button4" >
            <Link to='/main' className='button6'>Start</Link>
          </button>
        </div>
      </div>
    );

}
export default Start;