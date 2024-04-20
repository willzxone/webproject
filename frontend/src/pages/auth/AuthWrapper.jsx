/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase";
import { getPersistedUser } from "../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) dispatch(getPersistedUser(user));
      else navigate("/sign-in");
    });
  }, [dispatch, navigate]);
  if (auth.isSignIn) return <> {children} </>;
};

export default AuthWrapper;
