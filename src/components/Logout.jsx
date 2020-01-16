// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Avatar,
  Grid,
  Typography,
  Fab
} from "@material-ui/core";
import { Close as CloseIcon, OpenInNew as LogoutIcon } from "@material-ui/icons";

import conf from "../conf";

// -----------------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// -----------------------------------------------------------------------------

const styles = theme => ({
  avatar480dn: {
    margin: theme.spacing(4, 2, 1),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name480dn: {
    margin: theme.spacing(0, 2),
    width: theme.spacing(12)
  },
  avatar480up: {
    margin: theme.spacing(4, 4, 2),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name480up: {
    margin: theme.spacing(0, 4),
    width: theme.spacing(12)
  },
  title: {
    margin: theme.spacing(2, 2)
    // color: theme.palette.error.main
  },
  content: {
    margin: theme.spacing(2, 2)
  },
  actions: {
    margin: theme.spacing(2, 2)
  },
  button: {
    marginRight: theme.spacing(1)
  }
});

// -----------------------------------------------------------------------------

const LogoutDialog = withStyles(styles)(({ classes, router, open, setOpen }) => {
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    let uri = `${conf.urls.app}${conf.urls.logout}/${user._id}`;
    console.log("handleLogout(): Logging out... uri = ", uri);
    fetch(uri, {
      method: "GET",
      headers: new Headers({ authorization: `Bearer ${user.token}` })
    })
      .then(response => {
        if (response.ok) {
          // 200 OK => unset user
          dispatch({
            type: "user_update",
            payload: undefined
          });
          setOpen(false);
          router.push(conf.urls.app);

          // DEBUG
          response
            .json()
            .then(apiRes => {
              console.log("handleLogout(): Logout success, response =", apiRes);
            })
            .catch(err => {
              console.log("handleLogout(): Logout success with non-json response =", response, ", Error =", err);
            });
        } else {
          console.log("handleLogout(): Logout failed, response =", response);
        }
      })
      .catch(err => {
        console.log("handleLogout(): Fetch error =", err);
      });
  };

  const w350up = useMediaQuery("(min-width:350px)");
  const w480up = useMediaQuery("(min-width:480px)");

  return (
    <div>
      <Dialog maxWidth={"xs"} fullWidth={false} open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Avatar
              alt={user && user.name ? user.name : ""}
              src={user && user.avatar ? user.avatar : ""}
              className={w480up ? classes.avatar480up : classes.avatar480dn}
            />
            <Typography
              variant="subtitle2"
              display="block"
              align="center"
              // noWrap="true"
              className={w480up ? classes.name480up : classes.name480dn}
            >
              {user && user.name ? user.name : ""}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              align="center"
              noWrap={true}
              className={w480up ? classes.name480up : classes.name480dn}
            >
              ({user && user.clubName ? user.clubName : `${conf.labels.club[lang]}: ${conf.labels.none[lang]}`})
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <DialogTitle className={classes.title}>{"Logout"}</DialogTitle>
            <DialogContent className={classes.content}>
              <DialogContentText>Are you sure you want to logout?</DialogContentText>
            </DialogContent>
          </Grid>
          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container justify="center">
                {w480up ? <Grid item xs={1} /> : ""}
                <Grid item xs={w480up ? 5 : 6}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    {w350up ? <CloseIcon className={classes.button} /> : ""}
                    Cancel
                  </Fab>
                </Grid>
                <Grid item xs={w480up ? 5 : 6}>
                  <Fab variant="extended" size="medium" onClick={handleLogout} color="secondary">
                    {w350up ? <LogoutIcon className={classes.button} /> : ""}
                    Logout
                  </Fab>
                </Grid>{" "}
                {w480up ? <Grid item xs={1} /> : ""}
              </Grid>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
});

// -------------------------------------

LogoutDialog.propTypes = {
  router: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

export default LogoutDialog;

// -----------------------------------------------------------------------------
