import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../App";
import axios from 'axios'
import Cookies from 'js-cookie'

export default function Login() {
    const { state, dispatch } = useContext(AuthContext);
    const [data, setData] = useState({ errorMessage: "", isLoading: false });
    const [authToken, setAuthToken] = useState(null)
  
    const { client_id, redirect_uri } = state;

    Cookies.remove('github_authtoken')
  
    useEffect(() => {
      // After requesting Github access, Github redirects back to the app with a code parameter
      const url = window.location.href;
      const hasCode = url.includes("?code=");
    //   const authToken = setAuthToken(Cookies.get('authtoken'))
  
      // If Github API returns the code parameter
      if (hasCode) {
        const newUrl = url.split("?code=");
        // window.history.pushState({}, null, newUrl[0]);
        setData({ ...data, isLoading: true });

        console.log("Code = ", newUrl[1])
  
        const requestData = {
          code: newUrl[1]
        };

        console.log("Code = ", newUrl[1])
        // User is logged in and a previous authtoken is available
        // if(state.isLoggedIn)
        // {
        //     console.log("In here")
        //     axios.get('http://localhost:3030/getRepositories', {
        //         params: {code: newUrl[1]}
        //     })
        //     .then((response) => {
        //         console.log("Repositories = ", response.data)
        //     })

        //     setAuthToken(Cookies.get('github_authtoken'))
        // }
        // else
        // {
            const proxy_url = 'http://localhost:3030/auth'
  
            // Use code parameter and other parameters to make POST request to proxy_server
            axios.post(proxy_url, requestData, {
                withCredentials: true
            })
            .then((response) => {
                console.log("Response = ", response)
                dispatch({
                    type: "LOGIN",
                    payload: { user: response.data, isLoggedIn: true }
                });
                setAuthToken(Cookies.get('github_authtoken'))
            })
            .catch(error => {
                setData({
                isLoading: false,
                errorMessage: "Sorry! Login failed"
                });
            });

        }
    //   }
    }, [state, dispatch, data]);
  
    if (state.isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
        <>
            <a
                href={`https://github.com/login/oauth/authorize?scope=user:email read:org&client_id=${client_id}`}
                onClick={() => {
                setData({ ...data, errorMessage: "" });
                }}
            >
                <span>Login with GitHub</span>
            </a>
        </>
    )
} 