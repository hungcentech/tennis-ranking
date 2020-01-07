// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, IconButton, Typography, SvgIcon } from "@material-ui/core";
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey
} from "@material-ui/core/colors";

import HomeIcon from "@material-ui/icons/Home";
import LoginIcon from "@material-ui/icons/Facebook";
import LogoutIcon from "@material-ui/icons/OpenInNewRounded";

import config from "../config";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  homeButton: {
    marginLeft: -8,
    marginRight: 8
  },
  accountButton: {
    marginLeft: 8,
    marginRight: -8
  },
  toolbarMargin: theme.mixins.toolbar
});

// -----------------------------------------------------------------------------

const RoutedAppBar = withStyles(styles)(({ classes, router }) => {
  const appUrl = useSelector(state => state.config.appUrl);
  const loginUrl = useSelector(state => state.config.loginUrl);

  const user = useSelector(state => state.user);

  const location = router.location.pathname
    ? router.location.pathname.substr(appUrl ? appUrl.length : 0)
    : "/";
  const appBarTitle = useSelector(state => state.locations[location].appBarTitle);

  // DEBUG:
  // console.log("[DEBUG-Home]: state =", location);
  // console.log("[DEBUG-Home]: router =", router.location.pathname);

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          <IconButton
            className={classes.homeButton}
            color="inherit"
            aria-label="Home"
            href={appUrl + "/home"}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            {appBarTitle}
          </Typography>
          <IconButton
            className={classes.accountButton}
            color="inherit"
            href={appUrl + (user ? appUrl : appUrl + loginUrl)}
          >
            {user ? <LogoutIcon /> : <LoginIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </div>
  );
});

// ------------------------------------

RoutedAppBar.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default RoutedAppBar;

// -----------------------------------------------------------------------------
