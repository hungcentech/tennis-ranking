// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Avatar } from "@material-ui/core";
import { Language as LangIcon, Home as HomeIcon } from "@material-ui/icons";

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
    marginRight: theme.spacing(0),
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: `radial-gradient(center, ${theme.palette.grey[100]}, ${theme.palette.grey[900]})`
  }
});

// -----------------------------------------------------------------------------

const AppBar = withStyles(styles)(({ classes, router }) => {
  //
  let location = router.location.pathname;
  location = conf.urls.app ? location.substr(conf.urls.app.length) : location;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                if (router.location.pathname == conf.urls.app + conf.urls.home) {
                  dispatch({
                    type: "lang_update",
                    payload: {
                      newLang: lang == "en" ? "vi" : "en"
                    }
                  });
                } else {
                  router.push(conf.urls.app);
                }
              }}
            >
              {router.location.pathname == conf.urls.app + conf.urls.home ? <LangIcon /> : <HomeIcon />}
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {appBar.title[lang]}
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
