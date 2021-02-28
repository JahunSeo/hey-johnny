import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/:id">
          <App />
        </Route>
        <Route path="*">
          <Redirect to={`/PAGE_MAIN`}></Redirect>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
