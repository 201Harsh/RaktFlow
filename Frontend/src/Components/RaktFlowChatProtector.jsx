import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Config/Axios";
import { Bounce, toast } from "react-toastify";
import BloodPreloader from "./BloodPreloader";

const RaktFlowChatProtector = ({ children }) => {
  const [IsLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    const checkUser = async () => {
      try {
        const res = await AxiosInstance.get("/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          Navigate("/chat");
          setTimeout(() => {
            setIsLoading(false);
          }, 4000);
        } else {
          Navigate("/");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        localStorage.clear();
        Navigate("/");
      }
    };

    checkUser();
  }, [token, Navigate]);

  if (IsLoading) {
    return (
      <>
        <BloodPreloader />
      </>
    );
  }

  return <>{children}</>;
};

export default RaktFlowChatProtector;
