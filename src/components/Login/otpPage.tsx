import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface OtpPageProps {
  phoneNumber: string;
  setShowOtpField: React.Dispatch<React.SetStateAction<boolean>>;
}

const OtpPage: React.FC<OtpPageProps> = ({ phoneNumber, setShowOtpField }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(300);
  const [ResendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (ResendTimer === 0) {
      setCanResend(true);
    }
  }, [setCanResend, ResendTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setShowOtpField(false);
    }
  }, [setShowOtpField, timer]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const otpArray = pastedData.match(/\d/g);
    if (otpArray && otpArray.length === 4) {
      setOtp(otpArray);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index]) {
      e.preventDefault();
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const enteredOtp = otp.join("");

    const res = await fetch(
      `${process.env.REACT_APP_PUBLIC_API_URL}/api/verifyOtpForPhone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: enteredOtp,
        }),
        credentials: "include",
      }
    );
    const { success, message } = await res.json();
    console.log(success, message);
    if (success) {
      setIsError(false);
      toast.success(message);
      navigate("/task");
    } else {
      setIsError(true);
    }
  };

  const handleResendOtp = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_PUBLIC_API_URL}/api/resendLoginOtp`,
      {
        phone: phoneNumber,
      }
    );
    const { success, message } = res.data;
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div>
      <div className="mx-auto flex w-full sm:max-w-md max-w-sm flex-col space-y-8 m-4">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex flex-row items-center  font-semibold ">
            <div
              className="rounded-full cursor-pointer bg-gray-200 p-2 mr-4"
              onClick={() => setShowOtpField(false)}
            >
              <FiArrowLeft size={15} />
            </div>
            <p>Login using phone Number</p>
          </div>
          <div className="flex flex-row text-sm font-medium text-gray-400">
            <p>
              We have sent a code to your phone number{" "}
              <span className="font-bold text-black">{phoneNumber}</span>
            </p>
          </div>
          <div className="flex flex-row text-sm font-medium text-gray-400">
            <p>
              Valid For: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
              {timer % 60}
            </p>
          </div>
        </div>

        <div>
          <form onSubmit={handleOtpVerification}>
            <div className="flex flex-col space-y-4 mx-3">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center   px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      pattern="\d*"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onPaste={handleOtpPaste}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      ref={(ref) => (inputRefs.current[i] = ref)}
                    />
                  </div>
                ))}
              </div>

              <div className="text-red-500 text-sm font-medium h-[5px] text-center">
                {isError && (
                  <p>The OTP entered is incorrect. Please try again.</p>
                )}
              </div>

              <div className="flex flex-col space-y-5 ">
                <div>
                  <button className="flex flex-row items-center justify-center text-center w-full  border rounded-xl outline-none py-3 bg-red-500 hover:bg-red-700 border-none text-white text-sm shadow-sm">
                    Verify Account
                  </button>
                </div>

                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                  <p>Didn&apos;t recieve code?</p>{" "}
                  {canResend ? (
                    <p
                      className="flex flex-row items-center text-blue-600 cursor-pointer"
                      onClick={handleResendOtp}
                    >
                      Resend
                    </p>
                  ) : (
                    <p>Resend in {ResendTimer} seconds</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
