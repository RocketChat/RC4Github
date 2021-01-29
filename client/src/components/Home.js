import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../App";


export default function Home() {
  const { state, dispatch } = useContext(AuthContext);

  console.log("State = ",state)

  if (!state.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT"
    });
  } 

  return (
      <h1>Hello World</h1>
  )
}