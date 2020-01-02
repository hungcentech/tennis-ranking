// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { createMuiTheme, ThemeProvider, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { blue, pink } from "@material-ui/core/colors";

import RoutedAppBar from "./components/RoutedAppBar.jsx";
import Home from "./layouts/Home.jsx";
import MatchEdit from "./layouts/MatchEdit.jsx";
import MatchList from "./layouts/MatchList.jsx";
import PlayerEdit from "./layouts/PlayerEdit.jsx";
import PlayerList from "./layouts/PlayerList.jsx";

import config from "./config";

// -----------------------------------------------------------------------------

let muiTheme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: blue,
    error: {
      main: "#cf6679"
    }
    // type: "dark"
  }
});

const styles = theme => {
  return {
    root: {
      flex: 1
    }
  };
};

// -----------------------------------------------------------------------------

const RoutedApp = withStyles(styles)(({ classes, router, children }) => {
  const [account, setAccount] = useState(null);

  return (
    <div className={classes.root}>
      <RoutedAppBar router={router} account={account} />
      {children}
    </div>
  );
});

// -------------------------------------

RoutedApp.propTypes = {
  router: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router history={browserHistory}>
        <Redirect from="/tennisrankings" to="/tennisrankings/home" />
        <Route path="/tennisrankings" component={withRouter(RoutedApp)}>
          <Route path="players" component={withRouter(PlayerList)} />
          <Route path="players/:id" component={withRouter(PlayerEdit)} />
          <Route path="matches" component={MatchList} />
          <Route path="matches/:id" component={withRouter(MatchEdit)} />
          <Route path="*" component={withRouter(Home)} />
        </Route>
      </Router>
    </ThemeProvider>
  );
};

// -------------------------------------

App.propTypes = {};

// -----------------------------------------------------------------------------

ReactDOM.render(<App />, document.getElementById("contents"));

// -------------------------------------

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
