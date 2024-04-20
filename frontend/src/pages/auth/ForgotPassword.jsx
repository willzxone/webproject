import { Footer, Title, Banner } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { forgotPass } from "../../store/action/forgotPass";
import Input from "../../components/fields/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, []);

  useEffect(() => {
    if (email && emailRegex.test(email)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, emailRegex]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(forgotPass({ email })).then((response) => {
        if (response.type === forgotPass.rejected.toString()) {
          console.log(response.payload);
        } else if (response.type === forgotPass.fulfilled.toString()) {
          console.log("Reset Email Sent Succesfully");
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
            title="Forgot Password"
            desc="Enter your email address we will send the confirmation otp"
          />

          <div className="flex flex-col gap-5 w-full relative">
            <form className="flex flex-col gap-2 w-full">
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
            </form>
            <Footer
              btnText={isLoading ? "Loading" : "Submit"}
              disabled={!isFormValid || isLoading}
              onClick={submitHandler}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
