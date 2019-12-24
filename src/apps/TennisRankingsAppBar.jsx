// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -8,
    marginRight: 8
  },
  toolbarMargin: theme.mixins.toolbar
});

// -----------------------------------------------------------------------------

const TennisRankingsAppBar = withStyles(styles)(({ classes }) => (
  <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" className={classes.flex}>
          TGM Rankings
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    <div className={classes.toolbarMargin} />
  </div>
));

// ------------------------------------

TennisRankingsAppBar.propTypes = {};

// ------------------------------------

export default TennisRankingsAppBar;

// -----------------------------------------------------------------------------
