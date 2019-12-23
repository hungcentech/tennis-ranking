// -----------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import TennisRankingsApp from "./apps/TennisRankingsApp.jsx";

import MatchList from "./MatchList.jsx";
// import MatchEdit from "./MatchEdit.jsx";
import MatchAddNavItem from "./MatchAddNavItem.jsx";
// import PlayerList from "./PlayerList.jsx";
// import PlayerEdit from "./PlayerEdit.jsx";
// import PlayerAddNavItem from "./PlayerAddNavItem.jsx";

// -----------------------------------------------------------------------------

let theme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  palette: {
    primary: {
      main: "#64b5f6",
      contrastText: "#000"
    },
    secondary: {
      main: "#e57373",
      contrastText: "#000"
    },
    error: {
      main: "#cf6679",
      contrastText: "#000"
    },
    type: "light"
    // type: "dark"
  }
});

// -------------------------------------

const NotFound = () => <p>Page Not Found</p>;

// -------------------------------------

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router history={browserHistory}>
      <Redirect from="/" to="/matches" />
      <Route path="/" component={TennisRankingsApp}>
        <Route path="matches" component={withRouter(MatchList)} />
        {/* <Route path="matches/:id" component={MatchEdit} /> */}
        {/* <Route path="players" component={withRouter(PlayerList)} /> */}
        {/* <Route path="players/:id" component={PlayerEdit} /> */}
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </ThemeProvider>
);

// -------------------------------------

ReactDOM.render(<App />, document.getElementById("contents"));

// -------------------------------------

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
