import React from "react";
import styles from "./style";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Subscription from './components/Subscription'
import Webinar from "./components/Webinar";

function App() {
  return (
    <div className={`bg-gradient overflow-hidden ${styles.boxWidth} ${styles.paddingX}`}>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/webinar" element={<Webinar />} />
      </Routes>
    </div>
  );
}

export default App;
