import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Tour from "reactour";
import { IoMdAdd } from "react-icons/io";

import {
  Login,
  SignedLeftSidebar,
  AnonymousModeLeftSidebar,
  LoginRedirect,
  MainLayout,
} from "./";

function RestrictedRoute(restrictedRouteProps) {
  const { authState } = restrictedRouteProps;
  const [communityTourOpen, setCommunityTourOpen] = useState(false);
  const [communityTourStepNumber, setCommunityTourStepNumber] = useState(0);

  const stepsCreateCommunity = [
    {
      selector: ".communityTourButton",
      content: ()=> {
        return (
          <p>
            Communities form an umbrella for all your channels on RC4Git.
          </p>
        )
      },
      stepInteraction: false,
    },
    {
      selector: ".community-title",
      content: () => {
        return (
          <div>
            <p>
            You can create your own user community or for any of the organizations you have read permissions to.
            </p>

            <p style={{color:"#2f343d"}}>
            <strong>Let's create a new community!</strong>
            </p>
          </div>
        )
      },
      stepInteraction: false,
    },
    {
      selector: ".createButton",
      position: "bottom",
      content: ()=> {
        return (
          <div>
          <p>
            This is the create button. It enables you to create communities and channels on RC4Git.
          </p>

          <p style={{color:"#2f343d", display:"flex", alignItems:"center"}}>
          <strong>Click the <IoMdAdd style={{color:"#2f343d"}}/> button to get started.</strong>
          </p>
        </div>
        )
      },
    },
    {
      selector: ".createCommunityMenuItem",
      content: ()=> {
        return (
          <div>
          <p>
            Selecting the Create Community menu item would open up a modal for you to choose the community that you'd like to create.
          </p>

          <p style={{color:"#2f343d", display:"flex", alignItems:"center"}}>
          <strong>Select the Create Community menu item.</strong>
          </p>
        </div>
        )
      },
      position: "right",
    },
  ];
  return (
    <>
      {authState.isLoggedIn ? (
        <SignedLeftSidebar
          user={authState.user}
          communityTourStepNumber={communityTourStepNumber}
          setCommunityTourStepNumber={setCommunityTourStepNumber}
          setCommunityTourOpen={setCommunityTourOpen}
        />
      ) : (
        <AnonymousModeLeftSidebar />
      )}
      <MainLayout
        {...restrictedRouteProps}
        setCommunityTourOpen={setCommunityTourOpen}
      />
      <Tour
        disableFocusLock={true}
        steps={stepsCreateCommunity}
        isOpen={communityTourOpen}
        onRequestClose={() => {
          setCommunityTourOpen(false);
        }}
        disableDotsNavigation={true}
        disableKeyboardNavigation={true}
        goToStep={communityTourStepNumber}
        rounded={10}
        accentColor="#ee4a5b"
        showButtons={true}
      />
    </>
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
            component={LoginRedirect}
          />
          <RestrictedRoute
            path={"/"}
            authState={this.state.auth}
          />
        </Switch>
      </Router>
    );
  }
}
