import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Badge,
  Alert,
  Modal,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  MdDeleteSweep,
  MdEdit,
  MdWork,
  MdLocationOn,
  MdSchedule,
} from "react-icons/md";
import {
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaFlag,
} from "react-icons/fa";
import { BiBuildings } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addjob, jobdelete } from "../store/Createslice";
import SearchFilter from "./SearchFilter";
import Swal from "sweetalert2";
import "./EnhancedJobform.css";

const EnhancedJobform = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data.json");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      const data = result.jobs || [];
      const validData = data.filter((item) => item && item.id);

      setJobs(validData);
      setFilteredJobs(validData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load jobs. Please check your connection.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Cannot delete item with invalid ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Note: DELETE operation not supported with static JSON hosting
        // This is a client-side simulation only
        const response = { ok: true }; // Simulated response

        if (response.ok) {
          setJobs((prevData) => prevData.filter((item) => item.id !== id));
          setFilteredJobs((prevData) =>
            prevData.filter((item) => item.id !== id),
          );
          dispatch(jobdelete(id));

          Swal.fire("Deleted!", "Job has been deleted.", "success");
        } else {
          throw new Error(`Failed to delete item with ID: ${id}`);
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete job. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const addToWishlist = (item) => {
    dispatch(addjob(item));
    Swal.fire({
      title: "Added to Wishlist!",
      text: `${item.position} at ${item.company} has been added to your wishlist.`,
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
    });
  };

  const showJobDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "warning";
      case "interview":
        return "info";
      case "offer":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="enhanced-jobform-container">
      <div className="page-header">
        <h1 className="page-title">
          <MdWork className="me-3" />
          Job Applications
        </h1>
        <p className="page-subtitle">Manage and track your job applications</p>
      </div>

      <SearchFilter jobs={jobs} onFilteredResults={setFilteredJobs} />

      {filteredJobs.length === 0 ? (
        <div className="text-center">
          <Alert variant="info" className="no-jobs-alert">
            <MdWork size={48} className="mb-3" />
            <h4>No jobs found</h4>
            <p>
              {jobs.length === 0
                ? "Start by adding your first job application!"
                : "Try adjusting your search filters to find more jobs."}
            </p>
            <Button variant="primary" onClick={() => navigate("/Addjob")}>
              Add New Job
            </Button>
          </Alert>
        </div>
      ) : (
        <Row className="g-4">
          {filteredJobs.map((job) => {
            const daysUntilDeadline = getDaysUntilDeadline(job.deadline);

            return (
              <Col key={job.id} lg={4} md={6} sm={12}>
                <Card className="job-card h-100">
                  <div className={`job-status-bar status-${job.status}`} />

                  <Card.Header className="job-card-header">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="job-position mb-1">
                          {job.position || "Position Not Specified"}
                        </h6>
                        <div className="d-flex align-items-center text-muted">
                          <BiBuildings size={14} className="me-1" />
                          <small>
                            {job.company || "Company Not Specified"}
                          </small>
                        </div>
                      </div>
                      <div className="job-badges">
                        <Badge bg={getStatusColor(job.status)} className="mb-1">
                          {job.status}
                        </Badge>
                        {job.priority && (
                          <Badge
                            bg={getPriorityColor(job.priority)}
                            className="priority-badge"
                          >
                            <FaFlag size={10} className="me-1" />
                            {job.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card.Header>

                  <Card.Body className="job-card-body">
                    <div className="job-details">
                      <div className="job-detail-item">
                        <MdLocationOn className="detail-icon text-muted" />
                        <span>{job.location || "Location not specified"}</span>
                      </div>

                      <div className="job-detail-item">
                        <MdSchedule className="detail-icon text-muted" />
                        <span>{job.jobType || "Type not specified"}</span>
                      </div>

                      {job.salary && (
                        <div className="job-detail-item">
                          <FaDollarSign className="detail-icon text-success" />
                          <span>{job.salary}</span>
                        </div>
                      )}

                      <div className="job-detail-item">
                        <FaCalendarAlt className="detail-icon text-info" />
                        <span>Applied: {formatDate(job.appliedDate)}</span>
                      </div>

                      {job.deadline && (
                        <div className="job-detail-item">
                          <FaCalendarAlt className="detail-icon text-warning" />
                          <span>
                            Deadline: {formatDate(job.deadline)}
                            {daysUntilDeadline !== null && (
                              <Badge
                                bg={
                                  daysUntilDeadline < 7
                                    ? "danger"
                                    : daysUntilDeadline < 14
                                      ? "warning"
                                      : "success"
                                }
                                className="ms-2"
                              >
                                {daysUntilDeadline > 0
                                  ? `${daysUntilDeadline} days left`
                                  : "Expired"}
                              </Badge>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {job.notes && (
                      <div className="job-notes mt-3">
                        <small className="text-muted">
                          {job.notes.length > 80
                            ? `${job.notes.substring(0, 80)}...`
                            : job.notes}
                        </small>
                      </div>
                    )}
                  </Card.Body>

                  <Card.Footer className="job-card-footer">
                    <div className="job-actions">
                      <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => showJobDetails(job)}
                        >
                          <FaExternalLinkAlt />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        overlay={<Tooltip>Add to Wishlist</Tooltip>}
                      >
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => addToWishlist(job)}
                        >
                          <MdWork />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Edit Job</Tooltip>}>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => navigate(`/Addjob?edit=${job.id}`)}
                        >
                          <MdEdit />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Delete Job</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                        >
                          <MdDeleteSweep />
                        </Button>
                      </OverlayTrigger>
                    </div>

                    {job.source && (
                      <div className="job-source mt-2">
                        <small className="text-muted">
                          Source: {job.source}
                        </small>
                      </div>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Job Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedJob?.position} at {selectedJob?.company}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob && (
            <Row>
              <Col md={6}>
                <h6>Job Information</h6>
                <p>
                  <strong>Position:</strong> {selectedJob.position}
                </p>
                <p>
                  <strong>Company:</strong> {selectedJob.company}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
                <p>
                  <strong>Job Type:</strong> {selectedJob.jobType}
                </p>
                <p>
                  <strong>Status:</strong>
                  <Badge
                    bg={getStatusColor(selectedJob.status)}
                    className="ms-2"
                  >
                    {selectedJob.status}
                  </Badge>
                </p>
                {selectedJob.priority && (
                  <p>
                    <strong>Priority:</strong>
                    <Badge
                      bg={getPriorityColor(selectedJob.priority)}
                      className="ms-2"
                    >
                      {selectedJob.priority}
                    </Badge>
                  </p>
                )}
              </Col>
              <Col md={6}>
                <h6>Application Details</h6>
                <p>
                  <strong>Applied Date:</strong>{" "}
                  {formatDate(selectedJob.appliedDate)}
                </p>
                {selectedJob.deadline && (
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {formatDate(selectedJob.deadline)}
                  </p>
                )}
                {selectedJob.salary && (
                  <p>
                    <strong>Salary:</strong> {selectedJob.salary}
                  </p>
                )}
                {selectedJob.source && (
                  <p>
                    <strong>Source:</strong> {selectedJob.source}
                  </p>
                )}
                {selectedJob.contactEmail && (
                  <p>
                    <strong>Contact:</strong>
                    <a
                      href={`mailto:${selectedJob.contactEmail}`}
                      className="ms-2"
                    >
                      {selectedJob.contactEmail}
                    </a>
                  </p>
                )}
              </Col>
              {selectedJob.notes && (
                <Col xs={12}>
                  <h6>Notes</h6>
                  <p className="notes-text">{selectedJob.notes}</p>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => addToWishlist(selectedJob)}>
            Add to Wishlist
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EnhancedJobform;
