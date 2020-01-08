// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { initStore } from "./state";
import { useDispatch, useSelector } from "react-redux";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { createMuiTheme, ThemeProvider, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { purple, yellow } from "@material-ui/core/colors";

import AppBar from "./components/AppBar.jsx";
import Home from "./components/Home.jsx";
import PlayerList from "./components/PlayerList.jsx";

import conf from "./conf";

// -----------------------------------------------------------------------------

const store = initStore();

// -----------------------------------------------------------------------------

let muiTheme = createMuiTheme({
  palette: {
    // primary: {
    //   main: blue[500]
    // },
    primary: yellow,
    secondary: purple,
    error: {
      main: "#cf6679"
    },
    type: "dark"
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
  const appUrl = conf.appUrl;
  const loginUrl = conf.loginUrl;
  const appDomain = conf.appDomain;
  // const dispatch = useDispatch();

  let location = appUrl ? router.location.pathname.substr(appUrl.length) : router.location.pathname;

  // useEffect(() => {
  //   dispatch({ type: "change location", payload: location });
  // }, []);

  return (
    <div className={classes.root}>
      <AppBar router={router} />
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
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router history={browserHistory}>
          <Redirect from="/tennisrankings" to="/tennisrankings/home" />
          <Route path="/tennisrankings" component={withRouter(RoutedApp)}>
            <Route path="home" component={withRouter(Home)} />
            <Route path="players" component={withRouter(PlayerList)} />
            {/* <Route path="players/:id" component={withRouter(PlayerEdit)} /> */}
            {/* <Route path="matches" component={MatchList} /> */}
            {/* <Route path="matches/:id" component={withRouter(MatchEdit)} /> */}
            <Route path="*" component={withRouter(Home)} />
            {/* <Redirect from="*" to="/tennisrankings/home" /> */}
          </Route>
        </Router>
      </ThemeProvider>
    </Provider>
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
