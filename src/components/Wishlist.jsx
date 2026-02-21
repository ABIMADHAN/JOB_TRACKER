import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { MdDeleteSweep } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jobdelete } from "../store/Createslice";
const Wishlist = () => {
  let [data, setdata] = useState([]);

  const dispatch = useDispatch();
  const wishlistJobs = useSelector((state) => state.jobs);
  console.log("Wishlist jobs from Redux:", wishlistJobs);

  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(jobdelete(id));
    console.log("Removed job with ID:", id);
  };

  const jobsToDisplay =
    wishlistJobs && wishlistJobs.length > 0 ? wishlistJobs : data;

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Wishlist Jobs</h1>

      {!jobsToDisplay || jobsToDisplay.length === 0 ? (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <p>Your wishlist is empty. Add some jobs from the Job Form.</p>
        </div>
      ) : (
        <div
          className="card-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {jobsToDisplay.map((item, index) => (
            <Card
              key={`job-${item.id || index}`}
              style={{
                width: "24rem",
                margin: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  height: "8px",
                  backgroundColor:
                    item.status === "applied"
                      ? "#0d6efd"
                      : item.status === "interview"
                        ? "#198754"
                        : item.status === "rejected"
                          ? "#dc3545"
                          : "#6c757d",
                }}
              />

              <Card.Body>
                <Card.Title>
                  {item.position || "Position Not Specified"}
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  {item.company || "Company"}
                </Card.Subtitle>

                <Card.Text>
                  <strong>Location:</strong> {item.location || "Not specified"}
                  <br />
                  <strong>Type:</strong> {item.jobType || "Not specified"}
                  <br />
                  <strong>Status:</strong> {item.status || "Not specified"}
                  <br />
                  <strong>Applied Date:</strong>{" "}
                  {item.appliedDate || "Not specified"}
                  <br />
                  <strong>Deadline:</strong> {item.deadline || "Not specified"}
                </Card.Text>

                <hr />

                <div>
                  <strong>Notes:</strong>
                  <p>
                    {item.notes
                      ? item.notes.length > 100
                        ? item.notes.substring(0, 100) + "..."
                        : item.notes
                      : "No notes available"}
                  </p>
                </div>

                <Button
                  variant="primary"
                  style={{ margin: "5px" }}
                  onClick={() => handleRemove(item.id)}
                >
                  <MdDeleteSweep />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
