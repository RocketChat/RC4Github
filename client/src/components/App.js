import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import { Home, Login, SignedChatScreen, AnonymousModeChatScreen, LoginRedirect } from "./";

function PrivateRoute(privateRouteProps) {
  const { path, authState, component: Component } = privateRouteProps;
  return (
    <Route
      exact
      path={path}
      render={(props) => {
        return authState.isLoggedIn ? (
          <>
            <Component {...props} user={authState.user} />
          </>
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}

function RestrictedRoute(restrictedRouteProps) {
  const { path, authState } = restrictedRouteProps;
  return (
    <Route
      path={path}
      render={(props) => {
        return authState.isLoggedIn ? (
          <SignedChatScreen {...props} user={authState.user} />
        ) : (
          <AnonymousModeChatScreen {...props} />
        );
      }}
    />
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
        <Switch>
          <RestrictedRoute path={["/channel", "/group", "/direct"]} authState={this.state.auth} />
          <PrivateRoute
            path={"/home"}
            component={Home}
            authState={this.state.auth}
          />
          <Route
            path="/login"
            render={() => (
              <Login
                authState={this.state.auth}
                setAuthState={this.setAuthState}
              ></Login>
            )}
          />
          <Route
            path="/redirect/login"
            render={() => (
              <LoginRedirect
                authState={this.state.auth}
              ></LoginRedirect>
            )}
          />
          <PrivateRoute
            path={"/"}
            component={Home}
            authState={this.state.auth}
          />
        </Switch>
      </Router>
    );
  }
}
