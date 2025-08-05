import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import RaktFlowChat from "../Pages/RaktFlowChat";
import AutoRedirect from "../Components/AutoRedirect";
import RaktFlowChatProtector from "../Components/RaktFlowChatProtector";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <RaktFlowChatProtector>
              <RaktFlowChat />
            </RaktFlowChatProtector>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
