import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Badge,
  Card,
} from "react-bootstrap";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
} from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import "./SearchFilter.css";

const SearchFilter = ({ jobs, onFilteredResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRange, setDateRange] = useState("all");

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  useEffect(() => {
    filterAndSortJobs();
  }, [
    searchTerm,
    statusFilter,
    locationFilter,
    jobTypeFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    dateRange,
    jobs,
  ]);

  const filterAndSortJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((job) => job.priority === priorityFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const daysDiff = {
        week: 7,
        month: 30,
        quarter: 90,
      };

      if (daysDiff[dateRange]) {
        const cutoffDate = new Date(
          now.getTime() - daysDiff[dateRange] * 24 * 60 * 60 * 1000
        );
        filtered = filtered.filter(
          (job) => new Date(job.appliedDate) >= cutoffDate
        );
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date sorting
      if (sortBy === "appliedDate" || sortBy === "deadline") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredJobs(filtered);
    onFilteredResults(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
    setJobTypeFilter("all");
    setPriorityFilter("all");
    setSortBy("appliedDate");
    setSortOrder("desc");
    setDateRange("all");
  };

  const getUniqueLocations = () => {
    const locations = jobs.map((job) => job.location).filter(Boolean);
    return [...new Set(locations)];
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all",
    locationFilter !== "all",
    jobTypeFilter !== "all",
    priorityFilter !== "all",
    dateRange !== "all",
  ].filter(Boolean).length;

  return (
    <Card className="search-filter-card mb-4">
      <Card.Header className="search-filter-header">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 text-white">
            <FaFilter className="me-2" />
            Search & Filter Jobs
          </h5>
          {activeFiltersCount > 0 && (
            <Badge bg="light" text="dark" className="active-filters-badge">
              {activeFiltersCount} active filter
              {activeFiltersCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {/* Search Bar */}
          <Col md={6}>
            <Form.Label className="filter-label">Search</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by company, position, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </Col>

          {/* Status Filter */}
          <Col md={3} sm={6}>
            <Form.Label className="filter-label">Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Col>

          {/* Priority Filter */}
          <Col md={3} sm={6}>
            <Form.Label className="filter-label">Priority</Form.Label>
            <Form.Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Form.Select>
          </Col>

          {/* Location Filter */}
          <Col md={4} sm={6}>
            <Form.Label className="filter-label">Location</Form.Label>
            <Form.Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Locations</option>
              {getUniqueLocations().map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Job Type Filter */}
          <Col md={4} sm={6}>
            <Form.Label className="filter-label">Job Type</Form.Label>
            <Form.Select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </Form.Select>
          </Col>

          {/* Date Range Filter */}
          <Col md={4} sm={6}>
            <Form.Label className="filter-label">Date Range</Form.Label>
            <Form.Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </Form.Select>
          </Col>

          {/* Sorting Options */}
          <Col md={8}>
            <Form.Label className="filter-label">Sort By</Form.Label>
            <Row className="g-2">
              <Col>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="appliedDate">Application Date</option>
                  <option value="deadline">Deadline</option>
                  <option value="company">Company</option>
                  <option value="position">Position</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="sort-order-btn"
                >
                  {sortOrder === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  )}
                </Button>
              </Col>
            </Row>
          </Col>

          {/* Clear Filters Button */}
          <Col md={4} className="d-flex align-items-end">
            <Button
              variant="outline-secondary"
              onClick={clearFilters}
              className="clear-filters-btn w-100"
              disabled={activeFiltersCount === 0}
            >
              <BiRefresh className="me-1" />
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Results Summary */}
        <div className="results-summary mt-3">
          <small className="text-muted">
            Showing {filteredJobs.length} of {jobs.length} job
            {jobs.length !== 1 ? "s" : ""}
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchFilter;
