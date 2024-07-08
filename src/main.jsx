import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Test from "./Test.jsx"
import { ChakraProvider } from "@chakra-ui/react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import LoginForm from "./components/LoginForm";
// import Home from "./components/Home";
// import PrivateRoutes from "./utils/PrivateRoutes";
// import { AuthProvider } from "./utils/AuthProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
