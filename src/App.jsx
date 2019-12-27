// -----------------------------------------------------------------------------

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, pink } from "@material-ui/core/colors";

import Home from "./layouts/Home.jsx";
// import Matches from "./layouts/Matches.jsx";
// import Match from "./layouts/Match.jsx";
import Players from "./layouts/Players.jsx";
// import Player from "./layouts/Player.jsx";
// import Teams from "./layouts/Teams.jsx";
// import Team from "./layouts/Team.jsx";

// -----------------------------------------------------------------------------

let muiTheme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: blue,
    // primary: {
    //   main: "#64b5f6"
    // },
    // secondary: {
    //   main: "#e57373"
    // },
    error: {
      main: "#cf6679"
    },
    type: "dark"
  }
});

// -------------------------------------

const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <div>
        <CssBaseline />
        <Router history={browserHistory}>
          {/* <Redirect from="/" to="/home" /> */}
          <Route path="/" component={Home} />
          <Route path="players" component={withRouter(Players)} />
          {/* <Route path="matches" component={Matches} /> */}
          {/* <Route path="matches/:id" component={withRouter(Match)} /> */}
          {/* <Route path="players/:id" component={Player} /> */}
          <Route path="*" component={withRouter(Home)} />
        </Router>
      </div>
    </ThemeProvider>
  );
};

// -------------------------------------

ReactDOM.render(<App />, document.getElementById("contents"));

// -------------------------------------

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
