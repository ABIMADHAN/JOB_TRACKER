import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaBriefcase, 
  FaPlus, 
  FaList, 
  FaHeart, 
  FaChartPie, 
  FaHome,
  FaBell 
} from "react-icons/fa";
import { useSelector } from "react-redux";
import "./EnhancedNavbar.css";

const EnhancedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wishlistItems = useSelector(state => state.wishlist?.items || []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: FaChartPie },
    { path: "/Jobform", label: "All Jobs", icon: FaList },
    { path: "/Addjob", label: "Add Job", icon: FaPlus },
    { path: "/WishList", label: "Wishlist", icon: FaHeart, badge: wishlistItems.length }
  ];

  return (
    <Navbar expand="lg" className="enhanced-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <FaBriefcase className="brand-icon" />
          <span className="brand-text">JobTracker Pro</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`nav-link-custom ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <div className="nav-item-content">
                    <IconComponent className="nav-icon" />
                    <span className="nav-text">{item.label}</span>
                    {item.badge > 0 && (
                      <Badge bg="danger" className="nav-badge">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Nav.Link>
              );
            })}
          </Nav>

          <div className="navbar-actions">
            <Button
              variant="outline-light"
              className="notification-btn"
              onClick={() => navigate("/WishList")}
            >
              <FaBell />
              {wishlistItems.length > 0 && (
                <Badge bg="danger" className="notification-badge">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default EnhancedNavbar;