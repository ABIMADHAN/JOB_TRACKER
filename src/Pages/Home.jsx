import React from "react";
import Button from "react-bootstrap/Button";
import Jobform from "../components/Jobform";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();
  let jobformpage = () => {
    navigate("/Jobform"); 
  };
  return (
    <div className="Body">
      <img src="/images/download.png" id="image" alt="Download icon" />
      <h1 id="head"> Your AI Companion for Job Applications</h1>
      <p id="para">
        In the competitive job market, staying organized and presenting yourself
        effectively is crucial. JobTracker is here to simplify your job search
        journey by offering a comprehensive platform that streamlines your
        application process and helps you generate the needed documents.
      </p>
      <Button variant="warning" id="button" onClick={jobformpage}>
        START YOUR JOURNEY
      </Button>
      
    </div>
  );
};

export default Home;
