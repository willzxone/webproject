import { useEffect, useState, useMemo } from "react";
import { Footer, Title, Banner } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../../store/action/signInUser";
import { Link, useNavigate } from "react-router-dom";
import IconInput from "../../components/fields/iconInput";
import Input from "../../components/fields/input";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, []);

  useEffect(() => {
    if (email && emailRegex.test(email) && password && password.length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password, emailRegex]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(signInUser({ email, password })).then((response) => {
        if (response.type === signInUser.rejected.toString()) {
          console.log(response.payload);
        } else if (response.type === signInUser.fulfilled.toString()) {
          navigate("/");
        }
      });
    }
  };

  console.log(showPassword);

  return (
    <section className="w-full md:h-screen">
      <div className="flex items-center justify-between flex-col md:flex-row h-full w-full">
        <Banner />

        <div className="flex flex-col gap-5 2xl:gap-20 items-center justify-center w-full h-full px-5 pt-12 pb-36 md:p-10 lg:p-20 2xl:p-36 rounded-t-[2.5rem] bg-white -mt-10 md:mt-0">
          <Title
            title="Healer Sign in"
            desc="Enter your credential to access your account."
          />

          <div className="flex flex-col gap-5 w-full relative">
            <div className="flex flex-col gap-2 w-full">
              <Input
                htmlFor="email"
                label="Email Address"
                type="email"
                name="email"
                value={email}
                error={email && !emailRegex.test(email)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                placeholder="Password"
                src={`${
                  !showPassword
                    ? "/assets/icons/eye.svg"
                    : "/assets/icons/eye-slash.svg"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              />

              <Link
                to="/forgot-password"
                className="ml-auto text-xs text-red font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <Footer
              btnText={isLoading ? "Loading" : "Login"}
              disabled={!isFormValid || isLoading}
              onClick={submitHandler}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
