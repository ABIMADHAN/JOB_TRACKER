import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import Addjob from "./Pages/Addjob";
import Jobcard from "./components/Jobcard";
import Jobform from "./components/Jobform";
import EnhancedJobform from "./components/EnhancedJobform";
import EnhancedAddjob from "./components/EnhancedAddjob";
import Dashboard from "./components/Dashboard";
import Nav from "./Pages/Navbar";
import EnhancedNavbar from "./components/EnhancedNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import Wishlist from "./components/Wishlist";
function App() {
  localStorage.setItem("wishlist", JSON.stringify([])); // Initialize wishlist in localStorage if not present
  return (
    <BrowserRouter>
      <EnhancedNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Addjob" element={<EnhancedAddjob />} />
        
        <Route path="/jobcard" element={<Jobcard />} />
        <Route path="/Jobform" element={<EnhancedJobform />} />
        <Route path="/jobs" element={<EnhancedJobform />} />

        <Route path="/WishList" element={<Wishlist />} />
        
        <Route path="/old-addjob" element={<Addjob />} />
        <Route path="/old-jobform" element={<Jobform />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
