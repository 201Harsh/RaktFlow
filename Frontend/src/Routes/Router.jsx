import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import RaktFlowChat from "../Pages/RaktFlowChat";
import AutoRedirect from "../Components/AutoRedirect";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<RaktFlowChat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
