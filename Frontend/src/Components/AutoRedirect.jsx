import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoRedirect = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  useEffect(() => {
    if (token) {
      Navigate("/chat");
    } else {
      Navigate("/register");
    }
  }, [token, Navigate]);
};

export default AutoRedirect;
