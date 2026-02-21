import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert } from "react-bootstrap";
import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHandshake,
} from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import "./Dashboard.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs");
      const data = await response.json();
      setJobs(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const calculateStats = (jobsData) => {
    const stats = {
      total: jobsData.length,
      applied: jobsData.filter((job) => job.status === "applied").length,
      interview: jobsData.filter((job) => job.status === "interview").length,
      offer: jobsData.filter((job) => job.status === "offer").length,
      rejected: jobsData.filter((job) => job.status === "rejected").length,
    };
    setStats(stats);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <FaClock className="text-warning" />;
      case "interview":
        return <BiTrendingUp className="text-info" />;
      case "offer":
        return <FaHandshake className="text-success" />;
      case "rejected":
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaBriefcase />;
    }
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

  const recentJobs = jobs
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);
  const highPriorityJobs = jobs
    .filter((job) => job.priority === "high")
    .slice(0, 3);

  return (
    <Container fluid className="dashboard-container">
      <div className="dashboard-header mb-4">
        <h1 className="dashboard-title">
          <FaBriefcase className="me-3" />
          Job Application Dashboard
        </h1>
        <p className="dashboard-subtitle">Track your job search progress</p>
      </div>

      <Row className="mb-4">
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon total-icon mb-2">
                <FaBriefcase size={24} />
              </div>
              <h3 className="stat-number">{stats.total}</h3>
              <p className="stat-label">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon applied-icon mb-2">
                <FaClock size={24} />
              </div>
              <h3 className="stat-number">{stats.applied}</h3>
              <p className="stat-label">Applied</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon interview-icon mb-2">
                <BiTrendingUp size={24} />
              </div>
              <h3 className="stat-number">{stats.interview}</h3>
              <p className="stat-label">Interviews</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon offer-icon mb-2">
                <FaHandshake size={24} />
              </div>
              <h3 className="stat-number">{stats.offer}</h3>
              <p className="stat-label">Offers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon rejected-icon mb-2">
                <FaTimesCircle size={24} />
              </div>
              <h3 className="stat-number">{stats.rejected}</h3>
              <p className="stat-label">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon success-rate-icon mb-2">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="stat-number">
                {stats.total > 0
                  ? Math.round(
                      ((stats.interview + stats.offer) / stats.total) * 100
                    )
                  : 0}
                %
              </h3>
              <p className="stat-label">Success Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
       
        <Col lg={8} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="card-title mb-0">Recent Applications</h5>
            </Card.Header>
            <Card.Body>
              {recentJobs.length > 0 ? (
                <div className="recent-jobs-list">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="recent-job-item">
                      <div className="job-info">
                        <div className="d-flex align-items-center mb-1">
                          {getStatusIcon(job.status)}
                          <strong className="ms-2">{job.position}</strong>
                          <Badge
                            bg={getStatusColor(job.status)}
                            className="ms-2"
                          >
                            {job.status}
                          </Badge>
                          {job.priority && (
                            <Badge
                              bg={getPriorityColor(job.priority)}
                              className="ms-1"
                            >
                              {job.priority} priority
                            </Badge>
                          )}
                        </div>
                        <p className="job-company mb-1">{job.company}</p>
                        <small className="text-muted">
                          Applied:{" "}
                          {new Date(job.appliedDate).toLocaleDateString()}
                          {job.deadline &&
                            ` • Deadline: ${new Date(
                              job.deadline
                            ).toLocaleDateString()}`}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  No applications yet. Start by adding your first job
                  application!
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* High Priority Jobs */}
        <Col lg={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="card-title mb-0">High Priority Applications</h5>
            </Card.Header>
            <Card.Body>
              {highPriorityJobs.length > 0 ? (
                <div className="priority-jobs-list">
                  {highPriorityJobs.map((job) => (
                    <div key={job.id} className="priority-job-item">
                      <div className="d-flex align-items-center mb-1">
                        <strong>{job.position}</strong>
                        <Badge
                          bg={getStatusColor(job.status)}
                          className="ms-auto"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="job-company mb-1">{job.company}</p>
                      {job.deadline && (
                        <small className="text-danger">
                          Deadline:{" "}
                          {new Date(job.deadline).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="small-alert">
                  No high priority applications found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

     
      <Row>
        <Col className="mb-4">
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="card-title mb-0">
                Application Status Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="progress-charts">
                <div className="progress-item">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Applied ({stats.applied})</span>
                    <span>
                      {stats.total > 0
                        ? Math.round((stats.applied / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${
                          stats.total > 0
                            ? (stats.applied / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Interviews ({stats.interview})</span>
                    <span>
                      {stats.total > 0
                        ? Math.round((stats.interview / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-info"
                      style={{
                        width: `${
                          stats.total > 0
                            ? (stats.interview / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Offers ({stats.offer})</span>
                    <span>
                      {stats.total > 0
                        ? Math.round((stats.offer / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${
                          stats.total > 0
                            ? (stats.offer / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Rejected ({stats.rejected})</span>
                    <span>
                      {stats.total > 0
                        ? Math.round((stats.rejected / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${
                          stats.total > 0
                            ? (stats.rejected / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
