import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import { Home, Login, LeftSidebar, CreateCommunity } from "./";

function PrivateRoute(privateRouteProps) {
  const { path, authState, component: Component } = privateRouteProps;
  return (
    <Route
      exact
      path={path}
      render={(props) => {
        return authState.isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}

const checkAuth = () => {
  if (
    Cookies.get("rc4git_token") &&
    Cookies.get("rc_token") &&
    Cookies.get("rc_uid")
  ) {
    return {
      user: jwt_decode(Cookies.get("rc4git_token")),
      isLoggedIn: true,
      inProgress: false,
    };
  }
  return {
    user: {},
    isLoggedIn: false,
    inProgress: false,
  };
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: checkAuth(),
    };
  }

  setAuthState = (auth) => {
    return this.setState({
      auth,
    });
  };

  render() {
    return (
      <Router>
        {this.state.auth.isLoggedIn ? <LeftSidebar></LeftSidebar> : null}
        <Switch>
          <Route
            path="/login"
            render={() => (
              <Login
                authState={this.state.auth}
                setAuthState={this.setAuthState}
              ></Login>
            )}
          ></Route>
          <PrivateRoute
            path="/create"
            component={CreateCommunity}
            authState={this.state.auth}
            ></PrivateRoute>
          <PrivateRoute
            path={"/"}
            component={Home}
            authState={this.state.auth}
          ></PrivateRoute>
        </Switch>
      </Router>
    );
  }
}
