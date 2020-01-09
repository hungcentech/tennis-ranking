// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Avatar } from "@material-ui/core";
import { Menu, Home, ArrowBack, SportsTennis } from "@material-ui/icons";

import conf from "../conf";
import LoginDialog from "./Login.jsx";
import LogoutDialog from "./Logout.jsx";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flex: 1
  },
  appBar: {
    top: "auto",
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: `radial-gradient(center, ${theme.palette.grey[100]}, ${theme.palette.grey[900]})`
  }
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
      case "Menu":
        return <Menu />;
      case "Home":
        return <Home />;
      case "ArrowBack":
        return <ArrowBack />;
      case "SportsTennis":
        return <SportsTennis />;
    }
  };

  return (
    <div className={classes.root}>
      <MuiAppBar color="inherit" position="fixed" className={classes.appBar}>
        {appBar ? (
          <Toolbar>
            {appBar.leftBtn ? (
              <IconButton
                edge="start"
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
              {user && !user.clubId && appBar.title.noClub ? appBar.title.noClub : appBar.title.main}
            </Typography>
            <div className={classes.grow} />
            <Avatar
              edge="end"
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
          </Toolbar>
        ) : (
          ""
        )}
      </MuiAppBar>

      <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen} />
      <LogoutDialog router={router} open={logoutDialogOpen} setOpen={setLogoutDialogOpen} />
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
