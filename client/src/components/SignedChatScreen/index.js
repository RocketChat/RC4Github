import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./../ChatWindow/";
import { useEffect } from "react";
import Cookies from "js-cookie";

import './index.css';

export default function SignedChatScreen(props) {

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    const proxy_url = "http://localhost:3030/auth/github/upgrade";

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
        console.log("Private repo token  = ", data.data.gh_private_repo_token)
          Cookies.set("gh_private_repo_token", data.data.gh_private_repo_token);
          window.history.back();
        })
        .catch(error => console.log(error));
  }
})
  // if(location == '/' || location == '/home'){
  //   return (
  //     <>
  //       <LeftSidebar {...props}></LeftSidebar>
  //       <Home></Home>
  //     </>
  //   );
  // }
  return (
    <>
      <LeftSidebar {...props}></LeftSidebar>
      <ChatWindow {...props}></ChatWindow>
    </>
  );
}
