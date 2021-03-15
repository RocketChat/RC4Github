import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import ChatWindow from "../ChatWindow";
import Home from "./../Home";
import Cookies from "js-cookie";
import RightSidebar from "./../RightSidebar";

import "./index.css";

export default function MainLayout(props) {
  
  const {authState, stats} = props;

  return (
    <div className="mainLayout-wrapper">
      <ChatWindow {...props} />
      <Switch>
        <Route
          path={["/channel", "/group"]}
          render={(props) => {
            return <RightSidebar {...props} authState={authState} />;
          }}
        />
        <Route
          exact
          path={["/home", "/"]}
          render={(props) => {
            return <Home {...props} authState={authState} stats={stats} />;
          }}
        />
      </Switch>
    </div>
  );
}
