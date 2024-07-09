/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoutes from "./utils/PrivateRoutes";
// import { AuthProvider } from "./context/AuthProvider";
import Tool from "./Tools";
import Test from "./Test";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tool />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
