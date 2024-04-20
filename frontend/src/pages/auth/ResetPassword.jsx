import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Footer, Title, Banner } from "../../components/form";
import { resetPass } from "../../store/action/resetPass";
import IconInput from "../../components/fields/iconInput";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const oobCode = location.state?.oobCode;
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (password && password.length >= 8 && password === confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [password, confirmPassword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid && oobCode) {
      dispatch(resetPass({ oobCode, password })).then((response) => {
        if (response.type === resetPass.rejected.toString()) {
          console.log(response.payload);
        } else if (response.type === resetPass.fulfilled.toString()) {
          navigate("/sign-in");
          console.log("Password Reset Successfully");
        }
      });
    }
  };

  return (
    <section className="w-full md:h-screen">
      <div className="flex items-center justify-between flex-col md:flex-row h-full w-full">
        <Banner />

        <div className="flex flex-col gap-10 2xl:gap-20 items-center justify-center w-full h-full px-5 pt-12 pb-36 md:p-10 lg:p-20 2xl:p-36 rounded-t-[2.5rem] bg-white -mt-10 md:mt-0">
          <Title
            title="Reset Password"
            desc="Enter your credential to access your account."
          />

          <div className="flex flex-col gap-5 w-full relative">
            <div className="flex flex-col gap-2 w-full">
              <IconInput
                htmlFor="new-password"
                label="Enter New Password"
                type={showPassword ? "text" : "password"}
                name="new-password"
                value={password}
                error={password && password.length < 8}
                onChange={(e) => setPassword(e.target.value)}
                id="new-password"
                placeholder="Password"
                src={`${
                  !showPassword
                    ? "/assets/icons/eye.svg"
                    : "/assets/icons/eye-slash.svg"
                }`}
                alt="icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <IconInput
                htmlFor="confirm-password"
                label="Confirm Password"
                error={
                  password && confirmPassword && password !== confirmPassword
                }
                type={showConfirmPassword ? "text" : "password"}
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Password"
                src={`${
                  !showConfirmPassword
                    ? "/assets/icons/eye.svg"
                    : "/assets/icons/eye-slash.svg"
                }`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <Footer
              btnText={isLoading ? "Loading" : "login"}
              disabled={!isFormValid || isLoading}
              onClick={submitHandler}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
