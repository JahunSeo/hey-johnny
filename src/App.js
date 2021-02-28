import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Page from "./Page";
import { PAGES } from "./Page/Constant";

export default function App() {
  return (
    <Router basename="/hey-johnny">
      <Switch>
        <Route exact path="/:id">
          <Page />
        </Route>
        <Route path="*">
          <Redirect to={`/${PAGES.MAIN}`}></Redirect>
        </Route>
      </Switch>
    </Router>
  );
}
