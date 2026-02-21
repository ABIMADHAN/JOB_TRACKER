import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { MdDeleteSweep } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addjob, jobdelete } from "../store/Createslice"; // Import Redux actions

const Jobform = () => {
  let [data, setdata] = useState([]);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch jobs data
    fetch("/data.json", { method: "GET" })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        console.log("Received data:", result);
        const received = result.jobs || [];

        const validData = received.filter((item) => item && item.id);

        setdata(validData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setdata([]);
      });
  }, []);

  let handledelete = (id) => {
    if (!id) {
      console.error("Cannot delete item with invalid ID");
      return;
    }

    console.log(`Attempting to delete job with ID: ${id}`);

    // Note: DELETE operation not supported with static JSON hosting
    // This is a client-side simulation only
    const response = { ok: true, status: 200 }; // Simulated response

    Promise.resolve(response)
      .then((response) => {
        console.log(`Delete response status: ${response.status}`);
        if (response.ok) {
          // Update local state
          setdata((prevData) => prevData.filter((item) => item.id !== id));

          // Also delete from Redux store
          dispatch(jobdelete(id));

          console.log("Successfully deleted job with ID:", id);
        } else {
          throw new Error(
            `Failed to delete item with ID: ${id}, status: ${response.status}`,
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      });
  };
  // Function to add a job to the wishlist (Redux store)
  let addtocart = (item) => {
    // Use the imported action creator
    dispatch(addjob(item));

    console.log("Added job to wishlist:", item);
    // Navigate to the wishlist page to see the added job
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Job Form</h1>

      {!data || data.length === 0 ? (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <p>No jobs found. Please check your JSON server.</p>
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
          {data.map((item, index) => (
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
                </Card.Text>

                <hr />

                <div>
                  <label>Apply Before: </label>
                  <span>
                    {item.appliedDate
                      ? item.appliedDate.length > 100
                        ? item.appliedDate.substring(0, 100) + "..."
                        : item.appliedDate
                      : "No description available"}
                  </span>
                </div>

                <Button
                  variant="primary"
                  style={{ margin: "5px" }}
                  onClick={() => handledelete(item.id)}
                >
                  <MdDeleteSweep />
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    addtocart(item);
                  }}
                >
                  {" "}
                  View Details
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default Jobform;

/*"jobs": [
    {
      "id": 1,
      "company": "TechNova",
      "position": "Frontend Developer",
      "status": "applied",
      "appliedDate": "2025-07-01",
      "location": "New York, NY",
      "jobType": "Full-time",
      "notes": "Submitted through company website"
    },
    {
    */
