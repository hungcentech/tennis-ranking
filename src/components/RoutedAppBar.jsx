// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

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
  toolbarMargin: theme.mixins.toolbar
});

// -----------------------------------------------------------------------------

const RoutedAppBar = withStyles(styles)(({ classes, title }) => (
  <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        <IconButton className={classes.homeButton} color="inherit" aria-label="Home" href="/">
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" className={classes.flex}>
          {title}
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    <div className={classes.toolbarMargin} />
  </div>
));

// ------------------------------------

RoutedAppBar.propTypes = {};

// ------------------------------------

export default RoutedAppBar;

// -----------------------------------------------------------------------------
