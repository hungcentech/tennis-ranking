// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Avatar } from "@material-ui/core";
import { Home, ArrowBack, Facebook, TimeToLeave, SportsTennis, AccountBox } from "@material-ui/icons";

import conf from "../conf";
import LoginDialog from "./Login.jsx";
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
    margin: theme.spacing(0, 1, 0, -1)
  },
  rightBtn: {
    margin: theme.spacing(0, -1, 0, 1)
  },
  avatar: {
    margin: theme.spacing(0, 0, 0, 1),
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: `radial-gradient(center, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
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

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
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
            <Avatar
              alt={user && user.name ? user.name : ""}
              src={user && user.avatar ? user.avatar : ""}
              className={classes.avatar}
              onClick={
                user
                  ? () => {
                      setLogoutDialogOpen(true);
                    }
                  : () => {
                      setLoginDialogOpen(true);
                    }
              }
            />
            {/* <IconButton
              className={classes.rightBtn}
              color="inherit"
              onClick={
                user
                  ? () => {
                      setLogoutDialogOpen(true);
                    }
                  : () => {}
              }
              href={user ? "" : `${appUrl + loginUrl}`}
            >
              {user ? iconComponentFromName("AccountBox") : iconComponentFromName("Facebook")}
            </IconButton> */}
          </Toolbar>
        ) : (
          ""
        )}
      </MuiAppBar>

      <div className={classes.toolbarMargin} />

      <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen} />
      <LogoutDialog open={logoutDialogOpen} setOpen={setLogoutDialogOpen} />
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
