// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, IconButton, Typography, SvgIcon } from "@material-ui/core";

import { ArrowBack, Home, Facebook, SportsTennis, TimeToLeave } from "@material-ui/icons";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  leftBtn: {
    marginLeft: -8,
    marginRight: 8
  },
  rightBtn: {
    marginLeft: 8,
    marginRight: -8
  },
  toolbarMargin: theme.mixins.toolbar
});

// -----------------------------------------------------------------------------

const RoutedAppBar = withStyles(styles)(({ classes, router }) => {
  //
  const appUrl = useSelector(state => state.config.appUrl);
  const loginUrl = useSelector(state => state.config.loginUrl);

  const user = useSelector(state => state.user);
  let location = router.location.pathname;
  location = appUrl ? location.substr(appUrl.length) : location;

  //

  const appBarState = useSelector(state => state.locations[location].appBar);

  const iconComponentFromName = iconName => {
    switch (iconName) {
      case "ArrowBack":
        return <ArrowBack />;
      case "Home":
        return <Home />;
      case "Facebook":
        return <Facebook />;
      case "TimeToLeave":
        return <TimeToLeave />;
      case "SportsTennis":
        return <SportsTennis />;
    }
  };

  //

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          <IconButton className={classes.leftBtn} color="inherit" href={appUrl + appBarState.leftBtn.url}>
            {iconComponentFromName(appBarState.leftBtn.icon)}
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            {appBarState.title}
          </Typography>
          <IconButton className={classes.rightBtn} color="inherit" href={appUrl + "/uid=&token="}>
            {iconComponentFromName(appBarState.rightBtn.icon)}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </div>
  );

  //
});

// ------------------------------------

RoutedAppBar.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default RoutedAppBar;

// -----------------------------------------------------------------------------
