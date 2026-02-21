import React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";

const Addjob = () => {
  let [newdata, setnewdata] = useState({
    id: "",
    company: "",
    position: "",
    status: "applied",
    appliedDate: "2025-07-01",
    location: "",
    jobType: "Full-time",
    notes: "Submitted through company website",
  });

  let handlesubmit = (event) => {
    event.preventDefault();
    // Note: POST operation not supported with static JSON hosting
    // This is a client-side simulation only
    Promise.resolve({ ok: true })
      .then((response) => response)
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: "Job added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setnewdata({
          id: "",
          company: "",
          position: "",
          status: "applied",
          appliedDate: "2025-07-01",
          location: "",
          jobType: "Full-time",
          notes: "Submitted through company website",
        });
      })
      .catch((error) => {
        console.error("Error adding job:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add job. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const paperstyle = {
    border: "5px solid pink",
    borderRadius: "10px",
    borderblur: "10px",
    padding: "20px",
    width: "400px",
    height: "400px",
    margin: "20px auto",
    textAlign: "center",
  };
  let handle = (event) => {
    let { name, value } = event.target;
    setnewdata({
      ...newdata,
      [name]: value,
    });
  };
  return (
    <div>
      <Paper elevation={24} style={paperstyle}>
        <form onSubmit={handlesubmit} className="form">
          <h1>Job Details</h1>
          <TextField
            id="outlined-basic"
            label="Company"
            variant="outlined"
            name="company"
            value={newdata.company}
            onChange={handle}
          />
          <TextField
            id="outlined-basic"
            label="Position"
            variant="outlined"
            name="position"
            value={newdata.position}
            onChange={handle}
          />
          <TextField
            id="outlined-basic"
            label="Location"
            variant="outlined"
            name="location"
            value={newdata.location}
            onChange={handle}
          />
          <br />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Addjob;
