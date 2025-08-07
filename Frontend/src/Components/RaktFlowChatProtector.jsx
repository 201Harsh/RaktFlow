import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Config/Axios";
import { Bounce, toast } from "react-toastify";
import BloodPreloader from "./BloodPreloader";

const RaktFlowChatProtector = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const checkUser = async () => {
      try {
        const res = await AxiosInstance.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setIsLoading(false);
        } else {
          localStorage.clear();
          toast.error("Unauthorized", {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
            transition: Bounce,
          })
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data?.message || "Unauthorized", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });
        localStorage.clear();
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  if (isLoading) {
    return <BloodPreloader />;
  }

  return <>{children}</>;
};

export default RaktFlowChatProtector;
