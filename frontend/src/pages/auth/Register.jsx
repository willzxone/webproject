/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Title, Banner } from "../../components/form";
import ToggleButton from "../../components/form/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/action/registerUser";
import IconInput from "../../components/fields/iconInput";
import Input from "../../components/fields/input";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toggleForm, setToggleForm] = useState("healer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, []);

  useEffect(() => {
    if (
      email &&
      emailRegex.test(email) &&
      password &&
      password.length >= 8 &&
      password === confirmPassword
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password, confirmPassword, emailRegex]);

  const handleToggle = (formType) => {
    setToggleForm(formType);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(registerUser({ email, password })).then((response) => {
        if (response.type === registerUser.rejected.toString()) {
          console.log(response.payload);
        } else if (response.type === registerUser.fulfilled.toString()) {
          navigate("/sign-in");
        }
      });
    }
  };

  return (
    <section className="w-full min-h-screen h-full">
      <div className="flex justify-between flex-col md:flex-row h-full w-full">
        <Banner className="md:h-full md:min-h-screen md:fixed md:top-0 md:left-0 md:w-[47.3%]" />

        <div className="flex flex-col gap-3 items-center justify-center md:w-[53%] md:ml-auto h-full px-5 py-12 md:p-10 lg:px-20 lg:py-12 rounded-t-[2.5rem] bg-white -mt-10 md:mt-0">
          <Title
            title="Registration"
            desc="Enter your credential to access your account."
          />

          <div className="flex items-center justify-between gap-2 border-[1.3px] border-primary w-full p-2 rounded-xl">
            <ToggleButton
              img="/assets/icons/first-aid.svg"
              text="healer"
              toggleForm={toggleForm}
              active={toggleForm === "healer"}
              onClick={() => handleToggle("healer")}
            />
            <ToggleButton
              img="/assets/icons/user.svg"
              text="seeker"
              toggleForm={toggleForm}
              active={toggleForm === "seeker"}
              onClick={() => handleToggle("seeker")}
            />
          </div>

          <form
            className="flex flex-col gap-5 w-full relative"
            onSubmit={submitHandler}
          >
            <div className="flex flex-col gap-2 w-full">
              <Input
                htmlFor="email"
                type="email"
                value={email}
                error={email && !emailRegex.test(email)}
                label="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Name@gmail.com"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <IconInput
                htmlFor="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                error={password && password.length < 8}
                src={`${
                  !showPassword
                    ? "/assets/icons/eye.svg"
                    : "/assets/icons/eye-slash.svg"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <IconInput
                htmlFor="confirm-password"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                error={
                  password && confirmPassword && password !== confirmPassword
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirm-password"
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
              btnText={isLoading ? "Loading" : "Register Now"}
              disabled={!isFormValid || isLoading}
              onClick={submitHandler}
              signIn
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
