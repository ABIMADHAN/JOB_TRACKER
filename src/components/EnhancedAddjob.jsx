import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaBriefcase,
  FaSave,
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./EnhancedAddjob.css";

const EnhancedAddjob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [jobData, setJobData] = useState({
    id: "",
    company: "",
    position: "",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    deadline: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    priority: "medium",
    source: "Company Website",
    contactEmail: "",
    notes: "",
  });

  useEffect(() => {
    if (editId) {
      setIsEditing(true);
      fetchJobForEdit(editId);
    }
  }, [editId]);

  const fetchJobForEdit = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch("/data.json");
      if (response.ok) {
        const result = await response.json();
        const job = result.jobs.find((j) => j.id === id);
        setJobData(job);
      } else {
        throw new Error("Job not found");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load job data for editing.",
        icon: "error",
      });
      navigate("/Jobform");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!jobData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!jobData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!jobData.appliedDate) {
      newErrors.appliedDate = "Application date is required";
    }

    if (
      jobData.deadline &&
      new Date(jobData.deadline) < new Date(jobData.appliedDate)
    ) {
      newErrors.deadline = "Deadline cannot be before application date";
    }

    if (jobData.contactEmail && !/\S+@\S+\.\S+/.test(jobData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Note: POST/PUT operations not supported with static JSON hosting
      // This is a client-side simulation only
      const dataToSubmit = isEditing
        ? jobData
        : { ...jobData, id: Date.now().toString() };

      // Simulated response for static hosting
      const response = { ok: true };

      if (response.ok) {
        await Swal.fire({
          title: "Success!",
          text: `Job ${isEditing ? "updated" : "added"} successfully!`,
          icon: "success",
          confirmButtonText: "OK",
        });

        navigate("/Jobform");
      } else {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} job`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      Swal.fire({
        title: "Error!",
        text: `Failed to ${isEditing ? "update" : "add"} job. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setJobData({
      id: "",
      company: "",
      position: "",
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      deadline: "",
      location: "",
      jobType: "Full-time",
      salary: "",
      priority: "medium",
      source: "Company Website",
      contactEmail: "",
      notes: "",
    });
    setErrors({});
  };

  if (isLoading && isEditing) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading job data...</span>
      </Container>
    );
  }

  return (
    <Container className="enhanced-addjob-container">
      <div className="page-header">
        <Button
          variant="outline-secondary"
          className="back-btn mb-3"
          onClick={() => navigate("/Jobform")}
        >
          <FaArrowLeft className="me-2" />
          Back to Jobs
        </Button>

        <h1 className="page-title">
          <FaBriefcase className="me-3" />
          {isEditing ? "Edit Job Application" : "Add New Job Application"}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? "Update your job application details"
            : "Track your job application journey"}
        </p>
      </div>

      <Card className="job-form-card">
        <Card.Header className="form-header">
          <h5 className="mb-0 text-white">
            <FaBuilding className="me-2" />
            Job Details
          </h5>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Company and Position */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">
                    <FaBuilding className="me-2" />
                    Company Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={jobData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className={`form-input ${errors.company ? "is-invalid" : ""}`}
                  />
                  {errors.company && (
                    <div className="invalid-feedback">{errors.company}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">
                    <FaBriefcase className="me-2" />
                    Position *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={jobData.position}
                    onChange={handleInputChange}
                    placeholder="Enter job position"
                    className={`form-input ${errors.position ? "is-invalid" : ""}`}
                  />
                  {errors.position && (
                    <div className="invalid-feedback">{errors.position}</div>
                  )}
                </Form.Group>
              </Col>

              {/* Location and Job Type */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">
                    <FaMapMarkerAlt className="me-2" />
                    Location *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleInputChange}
                    placeholder="Enter job location"
                    className={`form-input ${errors.location ? "is-invalid" : ""}`}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Job Type</Form.Label>
                  <Form.Select
                    name="jobType"
                    value={jobData.jobType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Status and Priority */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">
                    Application Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={jobData.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">Priority Level</Form.Label>
                  <Form.Select
                    name="priority"
                    value={jobData.priority}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">Source</Form.Label>
                  <Form.Select
                    name="source"
                    value={jobData.source}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Company Website">Company Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Glassdoor">Glassdoor</option>
                    <option value="AngelList">AngelList</option>
                    <option value="Stack Overflow Jobs">
                      Stack Overflow Jobs
                    </option>
                    <option value="Referral">Referral</option>
                    <option value="University Portal">University Portal</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Dates */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">
                    Application Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="appliedDate"
                    value={jobData.appliedDate}
                    onChange={handleInputChange}
                    className={`form-input ${errors.appliedDate ? "is-invalid" : ""}`}
                  />
                  {errors.appliedDate && (
                    <div className="invalid-feedback">{errors.appliedDate}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">
                    Application Deadline
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={jobData.deadline}
                    onChange={handleInputChange}
                    className={`form-input ${errors.deadline ? "is-invalid" : ""}`}
                  />
                  {errors.deadline && (
                    <div className="invalid-feedback">{errors.deadline}</div>
                  )}
                </Form.Group>
              </Col>

              {/* Salary and Contact */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Salary Range</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={jobData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $70,000 - $90,000"
                    className="form-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    value={jobData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="hr@company.com"
                    className={`form-input ${errors.contactEmail ? "is-invalid" : ""}`}
                  />
                  {errors.contactEmail && (
                    <div className="invalid-feedback">
                      {errors.contactEmail}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Notes */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="form-label">Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="notes"
                    value={jobData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes about this application..."
                    className="form-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="form-divider" />

            <div className="form-actions">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={resetForm}
                disabled={isLoading}
                className="action-btn"
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="action-btn submit-btn"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEditing ? "Update Job" : "Save Job"}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EnhancedAddjob;
