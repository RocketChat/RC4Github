import {useEffect} from "react";
import { Route, Switch } from "react-router-dom";
import ChatWindow from "../ChatWindow";
import Home from "./../Home";
import Cookies from "js-cookie";
import {rc4gitApiDomain} from "./../../utils/constants";

export default function MainLayout(props) {
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    const proxy_url = `${rc4gitApiDomain}/auth/github/upgrade`;

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");

      const requestData = {
        code: newUrl[1],
      };

      fetch(proxy_url, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          Cookies.set("gh_private_repo_token", data.data.gh_private_repo_token);
          window.history.back();
        })
        .catch((error) => console.log(error));
    }
  });
  return (
    <Switch>
      <Route
        path={["/channel", "/direct", "/group"]}
        render={(props) => {
          return <ChatWindow {...props} />;
        }}
      />
      <Route exact path={["/home", "/"]} component={Home} />
    </Switch>
  );
}
