import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Page from "./Page";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/:id">
          <Page />
        </Route>
        <Route path="*">
          <Redirect to={`/main`}></Redirect>
        </Route>
      </Switch>
    </Router>
  );
}
