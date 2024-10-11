/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React from "react";
import { Route, Routes } from "react-router-dom";
// import PrivateRoutes from "./utils/PrivateRoutes";
// import { AuthProvider } from "./context/AuthProvider";
import Tools from "./components/Tools";
import CheckExcel from "./components/CheckExcel";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Tools />} />
      <Route path="/test" element={<CheckExcel />} />
    </Routes>
  );
};

export default App;
