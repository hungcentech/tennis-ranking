// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import { SwipeableDrawer, Grid, Card, CardMedia, CardContent } from "@material-ui/core";
import { Home, ArrowBack, Facebook, TimeToLeave, SportsTennis, AccountBox } from "@material-ui/icons";

import conf from "../conf";
import LogoutDialog from "./Logout.jsx";

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

const AppBar = withStyles(styles)(({ classes, router }) => {
  //
  const appUrl = conf.appUrl;
  const loginUrl = conf.loginUrl;

  let location = router.location.pathname;
  location = appUrl ? location.substr(appUrl.length) : location;

  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const user = useSelector(state => state.user);

  // DEBUG
  // console.log("pathname: ", router.location.pathname);
  // console.log("user: ", user);

  const appBar = conf.locations[location] ? conf.locations[location].appBar : undefined;

  const iconComponentFromName = iconName => {
    switch (iconName) {
      case "Home":
        return <Home />;
      case "ArrowBack":
        return <ArrowBack />;
      case "Facebook":
        return <Facebook />;
      case "TimeToLeave":
        return <TimeToLeave />;
      case "SportsTennis":
        return <SportsTennis />;
      case "AccountBox":
        return <AccountBox />;
    }
  };

  return (
    <div className={classes.root}>
      <MuiAppBar color="inherit" position="fixed">
        {appBar ? (
          <Toolbar>
            {appBar.leftBtn ? (
              <IconButton
                className={classes.leftBtn}
                color="inherit"
                onClick={() => {
                  appBar.leftBtn.url ? router.push(`${appUrl + appBar.leftBtn.url}`) : "";
                }}
              >
                {appBar.leftBtn.icon ? iconComponentFromName(appBar.leftBtn.icon) : ""}
              </IconButton>
            ) : (
              ""
            )}
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {appBar.title}
            </Typography>
            <IconButton
              className={classes.rightBtn}
              color="inherit"
              onClick={
                user
                  ? () => {
                      setAccountDialogOpen(true);
                    }
                  : () => {}
              }
              href={user ? "" : `${appUrl + loginUrl}`}
            >
              {user ? iconComponentFromName("AccountBox") : iconComponentFromName("Facebook")}
            </IconButton>
          </Toolbar>
        ) : (
          ""
        )}
      </MuiAppBar>

      <div className={classes.toolbarMargin} />

      <LogoutDialog open={accountDialogOpen} setOpen={setAccountDialogOpen} />
    </div>
  );

  //
});

// ------------------------------------

AppBar.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default AppBar;

// -----------------------------------------------------------------------------
