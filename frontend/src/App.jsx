import { createBrowserRouter, RouterProvider } from "react-router-dom";

// HealerLayout
import HealerLayout from "./Layout/healer/HealerLayout";

// Auth
import {
  ForgotPassword,
  OtpForgotPassword,
  Register,
  ResetPassword,
  SignIn,
} from "./pages/auth";

const healerRouter = createBrowserRouter([
  {
    path: "/",
    element: <HealerLayout />,
  },
  { path: "sign-in", element: <SignIn /> },
  { path: "register", element: <Register /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "forgot-password-otp", element: <OtpForgotPassword /> },

  // Page not found
  { path: "*", element: <PageNotFound /> },
]);

const promptBox = prompt("Enter user Type");

const userType = promptBox || "seeker";

const App = () => {
  return (
    <RouterProvider
      router={userType === "healer" ? healerRouter : seekerRouter}
    />
  );
};

export default App;
