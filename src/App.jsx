import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Charts from "./pages/Charts";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/charts" element={<Charts />} />
      </Routes>

    </BrowserRouter> 
  )
}

export default App;
