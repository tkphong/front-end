import React from "react";
import "./about.css";
import pic1 from "./tkphong.jpg";
import pic2 from "./tcluan.jpg";
import Navbar from "../../components/Navbar/Navbar";
const About = () => {
  return (
    <div className="About">
      <Navbar />
      <div class="about-section">
        <h1>THÔNG TIN NHÓM</h1>

      </div>
      <div class="content">
      <h2>Thành viên nhóm</h2>
      <div class="row">
        <div class="column">
          <div class="card">
            <div class="img-container"><img src={pic1} alt="Cam" width="300" height="310" /></div>
            <div class="container">
              <div>
                <div><h2>Trần Kiến Phong</h2>
                <div><p><a target="_blank" href="https://www.facebook.com/kphonggg"><i class="fab fa-facebook"></i></a><a target="_blank" href="https://github.com/tkphong"><i class="fab fa-github"></i></a></p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="img-container"><img src={pic2} alt="Duong" width="300" height="310" /></div>
            <div class="container">
              <div>
                <div><h2>Trình Công Luận</h2>
                <div><p><a target="_blank" href="https://www.facebook.com/profile.php?id=100016741716536"><i class="fab fa-facebook"></i></a><a target="_blank" href="https://gitlab.com/TrinhCongLuan"><i class="fab fa-github"></i></a></p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
export default About;

