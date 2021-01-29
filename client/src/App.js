import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateCommunity from './components/CreateCommunity';
import Login from "./components/Login";
import { initialState, reducer } from "./store/reducer";


export const AuthContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/" component={CreateCommunity}/>
      </Switch>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;