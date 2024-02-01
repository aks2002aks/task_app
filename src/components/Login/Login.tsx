import React, { useState } from "react";
import OtpPage from "./otpPage";
import axios from "axios";
type Props = {};

const Login = (props: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+\d{2}\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneSubmit = async () => {
    if (isValidPhoneNumber(phoneNumber)) {
      setShowOtpField(true);
      await axios.post(
        `${process.env.REACT_APP_PUBLIC_API_URL}/api/sendLoginOtp`,
        {
          phone: phoneNumber,
        }
      );
    } else {
      setErrorMessage("Please enter a valid phone number");
    }
  };

  return (
    <div className="bg-blue-400">
      <div className="relative">
        <img
          src={`https://source.unsplash.com/random/1920x1080/?nature`}
          alt="bgImage"
          className="object-cover overflow-hidden w-full h-96"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-500 opacity-60"></div>
        <div className="absolute top-52 flex justify-center items-center w-full">
          <div className="bg-white space-y-8 p-5 w-full rounded-md max-w-2xl flex flex-col justify-center items-center">
            <div className="text-2xl font-bold text-center">Welcome To Task Manager</div>
            {!showOtpField && (
              <React.Fragment>
                <div className="relative w-68 min-w-[180px] h-10">
                  <input
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    type="tel"
                    placeholder=""
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                    Phone number
                  </label>
                  <label className="text-[12px] ml-2 text-gray-600">
                    Example : +9163XXXXXX11
                  </label>
                </div>
                <div className="h-5">
                  <label>
                    {errorMessage && (
                      <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                  </label>
                </div>
                <div className="">
                  <button
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handlePhoneSubmit}
                  >
                    Login
                  </button>
                </div>
              </React.Fragment>
            )}

            {/* show otp field */}
            {showOtpField && (
              <OtpPage
                phoneNumber={phoneNumber}
                setShowOtpField={setShowOtpField}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
