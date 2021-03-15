import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { githubClientID } from "./../../utils/constants";

import "./index.css";

export default function Login(props) {
  const { authState, setAuthState } = props;
  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);

      setAuthState({ ...authState, inProgress: true });

      const requestData = {
        code: newUrl[1],
      };

      const proxy_url = `/api/login`;

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxy_url, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          Cookies.set("rc_token", data.data.rc_token);
          Cookies.set("rc_uid", data.data.rc_uid);
          Cookies.set("rc4git_token", data.data.rc4git_token);
          Cookies.set("gh_login_token", data.data.gh_login_token);
          setAuthState({
            user: jwt_decode(data.data.rc4git_token),
            isLoggedIn: true,
            inProgress: false,
          });
        })
        .catch((error) => {
          setAuthState({
            user: {},
            isLoggedIn: false,
            inProgress: false,
          });
        });
    }
  });
  if (props.authState.isLoggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="login-screen">
      <header className="login-header">
        <Link to="/">
          <img className="login-logo" src="/logo.svg" alt="RC-logo"></img>
        </Link>
      </header>
      <div
        className={
          authState.inProgress ? "login-card cursor-disabled" : "login-card"
        }
      >
        {authState.inProgress ? (
          <div className="login-button login-button-github">
            <FaGithub />
            <VscLoading />
          </div>
        ) : (
          <a
            className="login-button login-button-github"
            href={`https://github.com/login/oauth/authorize?client_id=${githubClientID}`}
          >
            <FaGithub />
            Login with github
          </a>
        )}
      </div>
      <div className="login-terms">
        <div className="powered-by">
          {"Powered by "}{" "}
          <a href="https://rocket.chat" target="_blank" rel="noreferrer">
            Open Source Chat Platform Rocket.Chat
          </a>
          .
        </div>
      </div>
    </div>
  );
}
