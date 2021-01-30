import './index.css'
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function LeftSidebar() {
    useEffect(() => {
        const url = window.location.href;
        const hasCode = url.includes("?code=");
    
        const proxy_url = "http://localhost:3030/auth/github/upgrade";
    
        // If Github API returns the code parameter
        if (hasCode) {
          const newUrl = url.split("?code=");
          window.history.pushState({}, null, newUrl[0]);
    
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
            })
            .catch(error => console.log(error));
      }
    })
    
    return (
        <div className="left-sidebar-wrapper">
        </div>
    )
}
