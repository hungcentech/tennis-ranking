// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, IconButton, Typography, SvgIcon } from "@material-ui/core";
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

const RoutedAppBar = withStyles(styles)(({ classes, router, account }) => {
  const getTitle = () => {
    try {
      let items = router.location.pathname.split("/");
      switch (items[2]) {
        case "rankings":
          return "Rankings";
        case "players":
          return "Players";
        case "matches":
          return "Matches";
      }
    } catch (err) {
      console.log("Error getting title: " + err);
    }
    return "TGM Rankings";
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            className={classes.homeButton}
            color="inherit"
            aria-label="Home"
            href={config.appUrl + "/home"}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            {getTitle()}
          </Typography>
          <IconButton
            className={classes.accountButton}
            color="inherit"
            href={config.appUrl + (account ? config.logoutUrl : config.loginUrl)}
          >
            {account ? <LogoutIcon /> : <LoginIcon />}
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
  // user: PropTypes.object.isRequired
};

// ------------------------------------

export default RoutedAppBar;

// -----------------------------------------------------------------------------
