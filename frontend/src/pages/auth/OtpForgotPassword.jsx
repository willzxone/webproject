import { useState, useRef } from "react";
import { Footer, Title, Banner } from "../../components/form";

export const OtpIcons = () => {
  let [otpValue, setOtpValue] = useState([]);

  const handleInputChange = (e, index) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue)) {
      let newOtpValue = [...otpValue];
      newOtpValue[index] = inputValue;
      setOtpValue(newOtpValue);
    }
  };
  const inputRefs = useRef([]);
  return (
    <div className="relative flex">
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (!isNaN(inputValue) && inputValue !== " ") {
                handleInputChange(e, index);
                if (inputValue && inputRefs.current[index + 1]) {
                  inputRefs.current[index + 1].focus();
                } else if (inputValue === "" && inputRefs.current[index - 1]) {
                  inputRefs.current[index - 1].focus();
                }
              }
            }}
            value={otpValue[index] || ""}
            className="w-10 aspect-square outline-none opacity-60 text-4xl text-center"
            style={{
              backgroundImage: otpValue[index]
                ? "none"
                : "url(/assets/icons/otp.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const OtpForgotPassword = () => {
  return (
    <section className="w-full md:h-screen">
      <div className="flex items-center justify-between flex-col md:flex-row h-full w-full">
        <Banner />

        <div className="flex flex-col gap-10 2xl:gap-20 items-center justify-center w-full h-full px-5 pt-12 pb-36 md:p-10 lg:p-20 2xl:p-36 rounded-t-[2.5rem] bg-white -mt-10 md:mt-0">
          <Title
            title="Forgot Password"
            desc="Enter your credential to access your account."
          />

          <div className="flex flex-col gap-5 w-full relative">
            <div className="flex flex-col gap-2 w-full">
              <p className="cursor-pointer capitalize mb-1 font-medium">
                Enter OTP
              </p>
              <div className="flex items-center justify-center gap-3 md:gap-5">
                <OtpIcons />
              </div>
            </div>

            <Footer btnText="confirm OTP" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpForgotPassword;
