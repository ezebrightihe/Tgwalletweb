import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/pin.css"; // Create this CSS file based on your preferred styles
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg"; // Adjust the import path as needed
import axios from "axios";
import BASE_URL from "../components/urls";
import mailBox from "../assets/mailBox.png"
const schema = yup.object().shape({
  emailOtp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 5 digits")
    .required("OTP is required"),
});

const EmailOtp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [Emailotp, setEmailOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...Emailotp];
    newOtp[index] = value;
    setEmailOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`emailOtp-${index + 1}`).focus();
    }

    setValue("emailOtp", newOtp.join(""));
  };

   const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/mail`, data) // Adjust the endpoint as needed
      .then((response) => {
        console.log(response.data);
        reset(); // Reset react-hook-form
        setOtp(new Array(5).fill("")); // Clear the OTP input fields
        navigate("/emailOtp"); // Replace with your desired route
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
            <div className="mailImg">
                <img src={mailBox} alt="" />
            </div>
          <div className="title">Check Your Email</div>
          <p>
            Please enter the code we have sent to your email
          </p>
        </div>
        <div className="formSec">
          <div className="input">
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="formOtp">
                {Emailotp.map((data, index) => (
                  <input
                    key={index}
                    id={`emailOtp-${index}`}
                    type="text"
                    name="emailOtp"
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
                  {loading ? "Verifying..." : "Submit"}
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

export default EmailOtp;
